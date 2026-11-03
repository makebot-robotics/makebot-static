{
  id: 17,                          // must be unique — nothing else uses this id yet
  name: 'Your Product Name',
  category: 'robotics',            // robotics | electronics | coding | science | art
  age: '8-12',
  price: 999,
  oldPrice: 1199,                  // or null if no discount
  difficulty: 'beginner',          // beginner | intermediate | advanced
  badge: 'new',                    // bestseller | new | hot | sale | '' (none)
  rating: 4.5,
  reviews: 50,
  desc: 'A short description of the product...',
  specs: {
    'Age Range': '8–12 years',
    'Difficulty': 'Beginner',
    // ...whatever spec rows make sense
  },
  imgs: [
    'https://your-image-url-1.jpg',
    'https://your-image-url-2.jpg',
  ],
},