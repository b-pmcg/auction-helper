import create from 'zustand';
import BigNumber from 'bignumber.js';
import { AUCTION_DATA_FETCHER } from '../constants';

const initialPageState = { pageStart: 0, pageEnd: 10, pageStep: 10 };

const transformEvents = async (auctions, service) => {
  const groupedEvents = _.groupBy(auctions, auction => auction.auctionId);

  let auctionsData = {};

  await Promise.all(
    Object.keys(groupedEvents).map(async id => {
      const { end, tic } = await service.getFlopDuration(id);

      auctionsData[id.toString()] = {
        auctionId: id,
        end,
        tic,
        events: groupedEvents[id]
      };
    })
  );

  return auctionsData;
};

const filters = {
  byPage: (state, ids) => {
    const { pageStart, pageEnd } = state;

    return ids.slice(pageStart, pageEnd);
  },

  byId: (ids, id) => {
    console.log(ids);
    
    return ids.filter(auctionId => (id ? auctionId === id : auctionId) );
  }
};

const sorters = {
  byLatest: auctions => {
    return Object.keys(auctions || []).reverse();
  },

  byBidPrice: auctions => {
    return Object.keys(auctions || [])
      .map(auctionId => {
        return auctions[auctionId].events.find(event => event.type !== 'Deal');
      })
      .map(event => {
        const bid = new BigNumber(event.bid);
        const lot = new BigNumber(event.lot);
        const bidPrice = lot.eq(new BigNumber(0)) ? lot : bid.div(lot);
        return {
          ...event,
          bid,
          lot,
          bidPrice
        };
      })
      .sort((prev, next) => {
        if (next.bidPrice.gt(prev.bidPrice)) return 1;
        if (next.bidPrice.lt(prev.bidPrice)) return -1;
        return 0;
      })
      .map(event => {
        return event.auctionId;
      });
  },

  byTime: auctions => {
    return Object.keys(auctions || []).sort((prevId, nextId) => {
      const now = new Date().getTime();

      const prev = auctions[prevId];
      const next = auctions[nextId];

      const prevTicEndMin = prev.tic.lt(prev.end) ? prev.tic : prev.end;
      const prevEndTime = prev.tic.eq(0) ? prev.end : prevTicEndMin;
      const prevTimeRemaining = prevEndTime.lte(now)
        ? new BigNumber(0)
        : prevEndTime.minus(now);

      const nextTicEndMin = next.tic.lt(next.end) ? next.tic : next.end;
      const nextEndTime = next.tic.eq(0) ? next.end : nextTicEndMin;
      const nextTimeRemaining = nextEndTime.lte(now)
        ? new BigNumber(0)
        : nextEndTime.minus(now);

      if (prevTimeRemaining.eq(0) || nextTimeRemaining.eq(0)) return -1;
      if (prevTimeRemaining.eq(nextTimeRemaining)) return 0;
      else if (prevTimeRemaining.lt(nextTimeRemaining)) return -1;
      else return 1;
    });
  }
};

const selectors = {
  hasPrevPageSelector: () => state => {
    const { pageStep, pageStart } = state;
    return pageStart - pageStep >= 0;
  },

  hasNextPageSelector: auctions => state => {
    const { pageEnd } = state;
    return pageEnd - (auctions || []).length < 0;
  },

  filteredAuctions: () => state => {
    const { filterByIdValue, auctions, sortBy } = state;
    if (!auctions) return null;

    console.log(sortBy);
    

    console.log(sorters[sortBy](auctions));

    let ids = Object.keys(auctions);   
    ids = filters.byId(sorters[sortBy](auctions), filterByIdValue);       
    

    return ids.map(id => auctions[id]);
  },

  auctionsPage: auctions => state => {
    if (!auctions) return null;
    return filters.byPage(state, auctions);
  }
};

const [useAuctionsStore] = create((set, get) => ({
  auctions: null,
  flopStepSize: 0,
  pageStart: 0,
  pageEnd: 10,
  pageStep: 10,
  sortBy: 'byLatest',
  filterByIdValue: '',

  nextPage: () => {
    const { pageStart, pageEnd, pageStep } = get();

    set({
      pageStart: pageStart + pageStep,
      pageEnd: pageEnd + pageStep
    });
  },

  prevPage: () => {
    const { pageStart, pageEnd, pageStep } = get();

    set({
      pageStart: pageStart - pageStep,
      pageEnd: pageEnd - pageStep
    });
  },

  setSortBy: sortBy => {
    set({ sortBy, ...initialPageState });
  },

  setFilterByIdValue: val => {
    set({
      filterByIdValue: val,
      ...initialPageState
    });
  },

  fetchAll: async maker => {
    const service = maker.service(AUCTION_DATA_FETCHER);
    const auctions = await service.fetchFlopAuctions();
    const transformedAuctions = await transformEvents(auctions, service);
    set({ auctions: transformedAuctions });
  },

  fetchSet: async ids => {
    const service = maker.service(AUCTION_DATA_FETCHER);
    const auctions = await service.fetchFlopAuctionsByIds(ids);
    const transformedAuctions = await transformEvents(auctions, service);

    const currentState = get().auctions || {};
    const updatedState = Object.assign({}, currentState, transformedAuctions);
    set({ auctions: updatedState });
  },

  fetchFlopStepSize: async maker => {
    const service = maker.service(AUCTION_DATA_FETCHER);
    set({ flopStepSize: await service.getFlopStepSize() });
  }
}));

export default useAuctionsStore;
export { filters, selectors };
