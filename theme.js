// example base theme from @theme-ui/presets
export default {
  useBorderBox: true,
  useBodyStyles: true,

  breakpoints: ['40em', '52em', '64em'],

  space: [0, 4, 8, 12, 14, 16, 24, 32, 64, 128, 256, 512],

  fonts: {
    body:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: 'inherit',
    monospace: 'Menlo, monospace'
  },

  fontSizes: [11, 13, 14, 15, 16, 18, 20, 24, 32, 48, 64, 96],

  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
    semiBold: 500
  },

  lineHeights: {
    body: 1.5,
    heading: 1.125
  },
  colors: {
    text: '#231536',
    background: '#F6F8F9',
    primary: '#1AAB9B',
    primaryHover: '#139D8D',
    primaryActive: '#098C7D',
    lightGreen: '#B6EDE7',
    purple: '#447AFB',
    blackThree: '#333',
    border: '#D4D9E1',
    white: '#fff'

    // text: '#000',
    // background: '#fff',
    // primary: '#07c',
    // secondary: '#30c',
    // muted: '#f6f6f6',
  },

  buttons: {
    primary: {
      outline: 'none',
      fontFamily: 'body',
      fontSize: 4,
      px: 5,
      color: 'white',
      bg: 'primary',
      '&:hover': {
        bg: 'primaryHover'
      },
      '&:active': {
        bg: 'primaryActive'
      },
      '&:disabled': {
        bg: 'lightGreen',
        pointerEvents: 'none',
        cursor: 'not-allowed'
      }
    },
    textual: {
      background: 'transparent',
      color: 'purple',
      outline: 'none',
      cursor: 'pointer',
      fontSize: 1,
    }
  },

  text: {
    heading: {
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading'
    },

    caps: {
      textTransform: 'uppercase',
      fontWeight: 'semiBold'
    },
    h2: {
      fontSize: 6,
      fontWeight: 'semiBold',
      letterSpacing: '0.4px'
    },
    boldBody: {
      fontSize: 4,
      fontWeight: 'semiBold',
      letterSpacing: '0.3px'
    },
    small: {
      fontSize: 1
    },
    smallDanger: {
      fontSize: 1,
      color: 'red'
    }
  },
  links: {
    nav: {
      fontSize: 5,
      fontWeight: 'body',
      letterSpacing: '0.4px',
      color: 'blackThree'
    }
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body'
    }
    // h1: {
    //   variant: 'text.heading',
    //   fontSize: 7,
    // },
    // h2: {
    //   variant: 'text.heading',
    //   fontSize: 6,
    //   fontWeight: 'body'
    // },
    // h3: {
    //   variant: 'text.heading',
    //   fontSize: 5,
    // },
    // h4: {
    //   variant: 'text.heading',
    //   fontSize: 4,
    // },
    // h5: {
    //   variant: 'text.heading',
    //   fontSize: 3,
    // },
    // h6: {
    //   variant: 'text.heading',
    //   fontSize: 2,
    // },
    // pre: {
    //   fontFamily: 'monospace',
    //   overflowX: 'auto',
    //   code: {
    //     color: 'inherit',
    //   },
    // },
    // code: {
    //   fontFamily: 'monospace',
    //   fontSize: 'inherit',
    // },
    // table: {
    //   width: '100%',
    //   borderCollapse: 'separate',
    //   borderSpacing: 0,
    // },
    // th: {
    //   textAlign: 'left',
    //   borderBottomStyle: 'solid',
    // },
    // td: {
    //   textAlign: 'left',
    //   borderBottomStyle: 'solid',
    // },
  }
};
