// example base theme from @theme-ui/presets
export default {
  useBorderBox: true,
  useBodyStyles: true,

  breakpoints: ['40em', '52em', '64em'],

  space: [0, 4, 8, 12, 14, 16, 24, 32, 64, 128, 256, 512],

  fonts: {
    body: '"SF Pro Text", sans-serif',
    heading: '"SF Pro Display", sans-serif',
    // body:
    // 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    // heading: 'inherit',
    monospace: 'monospace'
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

    graphite: '#48495F',
    lightGraphite: '#7E7E88',
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

  borders: {
    light: '1px solid'
  },

  buttons: {
    primary: {
      outline: 'none',
      fontFamily: 'body',
      fontSize: 4,
      px: 6,
      py: 3,
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
    pill: {
      outline: 'none',
      variant: 'text.caps',
      py: 2,
      px: 4,
      color: 'white',
      bg: 'primary'
    },
    pillInactive: {
      variant: 'buttons.pill',
      bg: 'transparent',
      color: 'lightGraphite',
      border: '1px solid',
      borderColor: 'border'
    },
    clear: {
      bg: 'transparent',
      p: 1
      // p: 0
    },
    textual: {
      background: 'transparent',
      color: 'purple',
      outline: 'none',
      cursor: 'pointer',
      fontSize: 1
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
      letterSpacing: '0.05em',
      color: 'graphite',
      fontSize: 0,
      fontWeight: 'bold'
    },

    h1: {
      fontSize: 8,
      letterSpacing: '0.3px',
      fontWeight: 'body'
    },

    h2: {
      fontSize: 6,
      lineHeight: '20px',
      fontWeight: 'semiBold',
      letterSpacing: '0.4px'
    },

    bigText: {
      fontSize: 8
    },
    boldBody: {
      fontSize: 4,
      fontWeight: 'semiBold',
      letterSpacing: '0.3px'
    },
    small: {
      fontSize: 1
    },
    inputText: {
      fontSize: 3,
      fontWeight: 'normal'
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
    },

    footer: {
      fontSize: 4,
      fontWeight: 'semiBold',
      letterSpacing: '0.4px',
      color: 'blackThree'
    }
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body'
    },
    roundedCard: {
      border: '1px solid',
      borderColor: 'border',
      p: 6,
      borderRadius: 6,
      bg: 'white'
    },
    h1: {
      variant: 'text.heading',
      fontSize: 7,
    },
    h2: {
      variant: 'text.heading',
      fontSize: 6,
      fontWeight: 'body'
    },
    h3: {
      variant: 'text.heading',
      fontSize: 4,
      py: 4,
      pb: 3,
      fontWeight: 600
    },
    h4: {
      variant: 'text.heading',
      fontSize: 4,
    },
    h5: {
      variant: 'text.heading',
      fontSize: 3,
    },
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
