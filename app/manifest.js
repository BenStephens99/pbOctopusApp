export default function manifest() {
  return {
    name: 'Energy App',
    short_name: 'Energy App',
    description: 'Energy App',
    start_url: '/properties',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon-256.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],
  }
}
