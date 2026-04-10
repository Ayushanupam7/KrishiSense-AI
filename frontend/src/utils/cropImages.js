/**
 * Utility to map crop names to their respective images.
 * You can add more local assets or high-quality remote URLs here.
 */

// If you have local images, import them here:
// import tomatoImg from '../assets/crops/tomato.jpg';

export const getCropImage = (cropName) => {
    const crop = cropName.toLowerCase();

    // Mapping for common Indian crops
    const imageMap = {
        'tomato': 'https://foodcare.in/cdn/shop/files/tomatoes-canva.webp?v=1768271474',
        'lime': 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&q=80&w=400',
        'bitter gourd': 'https://drvaidji.com/cdn/shop/articles/Bitter_Melon_1024x1024_37ab9838-93f6-4c88-83b4-508443174b78.jpg?v=1699514225',
        'cabbage': 'https://www.lovefoodhatewaste.com/sites/default/files/styles/16_9_two_column/public/2022-07/Cabbage.jpg.webp?itok=kC_qEday',
        'green chilli': 'https://m.media-amazon.com/images/I/61xy1eqNujL.jpg',
        'bengal gram': 'https://ooofarms.com/cdn/shop/products/Brownchana_UPDal.jpg?v=1738650252&width=1500',
        'potato': 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:420,cw:1080,ch:1080,q:80,w:1080/iC7HBvohbJqExqvbKcV3pP.jpg',
        'guar': 'https://img-cdn.krishijagran.com/76121/guar-seed-1.png',
        'onion': 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=400',
        'onion-green': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc76nopzXo2w5KR5Zy0Dd23OEqHsKof5gzfQ&s',
        'kheera': 'https://www.lipmanfamilyfarms.com/wp-content/uploads/2020/09/Cucumber-hero@2x-1024x696.png',
        'papaya': 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&q=80&w=400',
        'jowar': 'https://www.dairyknowledge.in/dkp/sites/default/files/styles/medium_large/public/sorghum.jpg?itok=8GAnwPuC',
        'sweet pumpkin': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJLldLl7Q5RU-77Z0399bTgupB7pNyyOgKHg&s',
        'bhindi': 'https://images.unsplash.com/photo-1425543103986-39af74de9af2?auto=format&fit=crop&q=80&w=400',
        'water melon': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400',
        'brinjal': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4zHOojIcNXfM6sfEpkwUWBJ_V6rdfb4iV3CacVYzdhFw4rRb2c8FKhXJovCmPBK0mUegXW4lZIJt-8UU4yLzuVL1AXAT3VBphfo7S3Q&s=10',
        'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400',
        'wheat': 'https://conceptitgroup.com/farmpro/wp-content/uploads/2020/10/wheet-1.jpg',
        'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
        'paddy': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
        'banana': 'https://frugivore-bucket.s3.amazonaws.com/media/package/img_one/2021-07-10/Standrad_Banana_WAnKgF3.jpg',
        'garlic': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=400',
        'ginger': 'https://images.unsplash.com/photo-1615485500704-8e411ef8d7ce?auto=format&fit=crop&q=80&w=400',
        'mustard': 'https://images.unsplash.com/photo-1444858291040-58f756a3bea6?auto=format&fit=crop&q=80&w=400',
        'chilli': 'https://images.unsplash.com/photo-1588276552401-30058a0fe57b?auto=format&fit=crop&q=80&w=400',
        'Soyabean': 'https://m.media-amazon.com/images/I/41lWSMRXG7L._AC_UF894,1000_QL80_.jpg',
        'cotton': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFp-vtBl5iO2ZpTfGeFoRg85WsMFM6DeaWNg&s',
        'pomegranate': 'https://plantsguru.com/cdn/shop/files/Ripe-Pomegranate-Fruit-on-Tree-Branch.jpg?v=1755687567',
        'bhindi': 'https://kyssafarms.com/cdn/shop/products/lady-finger.jpg?v=1600955405',
        'Cauliflower': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYNMhsJUynmjd7XRkWp2kpWZ6gNbhSt69fp2hlHy2jsFswt9wXp4bsc6A_Ev_bfESxZ2UBJARpF2KD9EJRENCltH0X9Yw2e_NEuk-NDA&s=10',

    };

    // Find the best match
    for (const [key, url] of Object.entries(imageMap)) {
        if (crop.includes(key)) return url;
    }

    // Default fallback
    return 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&q=80&w=400';
};
