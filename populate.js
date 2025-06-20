import {
    collection,
    doc,
    writeBatch,
    serverTimestamp,
  } from "firebase/firestore";
  import { db } from "./FirebaseConfig.ts";
  
  const restaurantId = "Food Zone";
  
  async function seedRestaurant() {
    // Parent document reference
    const restaurantRef = doc(db, "restaurants", restaurantId);
  
    // Sub‑collection reference
    const menuColRef = collection(restaurantRef, "menu");
  
    const menuItems = [
        {
          name: "Chicken Biryani",
          description: "Aromatic basmati rice cooked with marinated chicken, spices, and herbs, served with raita.",
          imageUrl: "https://img.freepik.com/premium-photo/chicken-biriyani-using-jeera-rice-arranged-earthenware-with-raitha-grey-background_527904-8.jpg?semt=ais_hybrid&w=740",
          price: 160,
          isAvailable: true,
          freq: 0,
        },
       
        {
          name: "Gobi fried rice",
          description: "Crispy cauliflower tossed in spicy Indo-Chinese sauce with spring onions.",
          imageUrl: "https://img.freepik.com/premium-photo/healthy-tasty-veg-fried-rice-made-mixed-veggies-served-bowl-rustic-wooden-background-indo-chinese-indian-cuisine-selective-focus_726363-515.jpg",
          price: 110,
          isAvailable: true,
          freq: 0,
        },
        {
          name: "Paneer fried rice",
          description: "Cottage cheese cubes simmered in a rich, creamy tomato-based gravy.",
          imageUrl: "https://img.freepik.com/premium-photo/healthy-tasty-veg-fried-rice-made-mixed-veggies-served-bowl-rustic-wooden-background-indo-chinese-indian-cuisine-selective-focus_726363-515.jpg",
          price: 130,
          isAvailable: true,
          freq: 0,
        },
        {
          name: "Veg Fried Rice",
          description: "Fried rice with mixed vegetables and Indo-Chinese flavors.",
          imageUrl: "https://img.freepik.com/premium-photo/healthy-tasty-veg-fried-rice-made-mixed-veggies-served-bowl-rustic-wooden-background-indo-chinese-indian-cuisine-selective-focus_726363-515.jpg",
          price: 90,
          isAvailable: true,
          freq: 0,
        },
        {
          name: "Chicken Fried Rice",
          description: "Wok-tossed rice with tender chicken pieces and vegetables.",
          imageUrl: "https://img.freepik.com/premium-photo/healthy-tasty-veg-fried-rice-made-mixed-veggies-served-bowl-rustic-wooden-background-indo-chinese-indian-cuisine-selective-focus_726363-515.jpg",
          price: 120,
          isAvailable: true,
          freq: 0,
        },
        {
          name: "Egg Noodles",
          description: "Stir-fried egg noodles with vegetables in tangy sauce.",
          imageUrl: "https://img.freepik.com/free-photo/noodles-with-beef-vegetables-black-table_141793-1729.jpg?semt=ais_hybrid&w=740",
          price: 100,
          isAvailable: true,
          freq: 0,
        }, {
            name: "Chicken Noodles",
            description: "Stir-fried egg noodles with vegetables in tangy sauce.",
            imageUrl: "https://img.freepik.com/free-photo/noodles-with-beef-vegetables-black-table_141793-1729.jpg?semt=ais_hybrid&w=740",
            price: 100,
            isAvailable: true,
            freq: 0,
          },
        {
          name: "Chicken Puff",
          description: "Crispy pastry filled with spicy minced chicken.",
          imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOnbc6XeUcHSqYlDaONC6DGgErBdGcCNxeXQ&s"
,
          price: 30,
          isAvailable: true,
          freq: 0,
        },
        {
          name: "Paneer Puff",
          description: "Flaky puff pastry with spiced paneer filling.",
          imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOnbc6XeUcHSqYlDaONC6DGgErBdGcCNxeXQ&s",
          price: 30,
          isAvailable: true,
          freq: 0,
        },
        {
          name: "Veg Sandwich",
          description: "Toasted sandwich with fresh veggies and chutneys.",
          imageUrl: "https://img.freepik.com/premium-photo/view-club-sandwich-with-bread-tomato-egg-various-vegetables-white-background_669966-7092.jpg?semt=ais_hybrid&w=740",
          price: 40,
          isAvailable: true,
          freq: 0,
        },
        {
          name: "Chicken Sandwich",
          description: "Grilled sandwich with spiced chicken filling.",
          imageUrl: "https://img.freepik.com/premium-photo/view-club-sandwich-with-bread-tomato-egg-various-vegetables-white-background_669966-7092.jpg?semt=ais_hybrid&w=740",
          price: 60,
          isAvailable: true,
          freq: 0,
        },
        {
          name: "Samosa",
          description: "Crispy pastry stuffed with spiced potato filling.",
          imageUrl: "https://img.freepik.com/premium-photo/veg-samosa-is-crispy-spicy-indian-triangle-shape-snack-which-has-crisp-outer-layer-maida-filling-mashed-potato-peas-spices_466689-72924.jpg",
          price: 15,
          isAvailable: true,
          freq: 0,
        },
        

        {
            name: "Coffee",
            description: "Chilled and creamy flavored milkshake with ice cream.",
            imageUrl: "https://img.freepik.com/free-photo/two-espresso-cups-coffee-engine_140725-5567.jpg?semt=ais_hybrid&w=740",
            price: 70,
            isAvailable: true,
            freq: 0,
          },
        
      ];
      
  
    const batch = writeBatch(db);
  
    // 1️⃣ create / update the restaurant document
    batch.set(
      restaurantRef,
      {
        createdAt: serverTimestamp(),   // Firestore timestamp
        isOpen: true,
        name: "Food Zone",
        admin: "foodzone@gmail.com",
        logo:"https://img.freepik.com/premium-vector/round-blank-label-retro-decorative-style-hipster-logo_543062-4250.jpg",
      },
      { merge: true }                  // keeps existing fields if the doc already exists
    );
  
    // 2️⃣ add each menu item in the sub‑collection
    menuItems.forEach((item) => {
      const menuDocRef = doc(menuColRef); // let Firestore pick a random ID
      batch.set(menuDocRef, item);
    });
  
    await batch.commit();
    console.log("Restaurant info + menu seeded ✅");
  }
  
  seedRestaurant()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
  