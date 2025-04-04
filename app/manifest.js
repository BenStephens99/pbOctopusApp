export default function manifest() {
  return {
    name: 'Energy App',
    short_name: 'Energy App',
    description: 'Energy App',
    start_url: '/properties',
    display: 'standalone',
    background_color: '#000',
    theme_color: '#000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/favicon-256.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],
  };
}
