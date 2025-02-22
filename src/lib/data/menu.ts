export interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export const featuredDish: MenuItem = {
  name: "Whole Roast Chicken",
  description: "Fresh whole roasted chicken with perfect seasoning and crispy skin",
  price: "£12.99",
  image: "/images/menu/menu.webp"
};

export const menuCategories: MenuCategory[] = [
  {
    name: "Wraps",
    items: [
      {
        name: "Chicken Shawarma Wraps",
        description: "Tender marinated chicken with fresh vegetables",
        price: "£4.99",
        image: "/images/menu/wrap.webp"
      },
      {
        name: "Pork Shawarma Wraps",
        description: "Pizza Sauce, Pepperoni slices, Mozzarella Cheese",
        price: "£4.99",
        image: "/images/menu/wrap.webp"
      },
      {
        name: "Roast Pork Wraps",
        description: "Pizza Sauce, pepperoni slices, salami, chicken, sausages, Beef, ham",
        price: "£4.99",
        image: "/images/menu/wrap.webp"
      },
      {
        name: "Falafel Wrap",
        description: "BBQ sauce, bacon, roasted chicken, onion, green peppers",
        price: "£3.99",
        image: "/images/menu/wrap.webp"
      },
      {
        name: "Cheese and Chips Wrap",
        description: "Fresh chips with melted cheese blend",
        price: "£3.99",
        image: "/images/menu/wrap.webp"
      }
    ]
  },
  {
    name: "Roast Chicken Meals",
    items: [
      {
        name: "Whole Roast Chicken",
        description: "Fresh whole roasted chicken",
        price: "£12.99",
        image: "/images/menu/achicken.webp"
      },
      {
        name: "Half Roast Chicken",
        description: "Half portion of roasted chicken",
        price: "£7.99",
        image: "/images/menu/achicken.webp"
      },
      {
        name: "Quarter Chicken",
        description: "Quarter portion of roasted chicken",
        price: "£5.99",
        image: "/images/menu/chicken.webp"
      },
      {
        name: "Chicken Wings BBQ",
        description: "BBQ flavored chicken wings",
        price: "£6.99",
        image: "/images/menu/achicken.webp"
      },
      {
        name: "Chicken Wings Regular",
        description: "Classic seasoned chicken wings",
        price: "£6.99",
        image: "/images/menu/achicken.webp"
      }
    ]
  },
  {
    name: "Burgers Meals",
    items: [
      {
        name: "Chicken Fillet Burger",
        description: "With roast potato or chips",
        price: "£5.99",
        image: "/images/menu/burger.webp"
      },
      {
        name: "Chicken Burger",
        description: "Classic chicken burger with fresh toppings",
        price: "£4.99",
        image: "/images/menu/burger.webp"
      },
      {
        name: "Roast Pork Burger",
        description: "Roasted pork with special sauce",
        price: "£5.99",
        image: "/images/menu/burger.webp"
      },
      {
        name: "Mexican Burger",
        description: "Spicy Mexican-style burger",
        price: "£5.99",
        image: "/images/menu/burger.webp"
      },
      {
        name: "Hawaiian Burger",
        description: "Tropical Hawaiian-style burger",
        price: "£5.99",
        image: "/images/menu/burger.webp"
      },
      {
        name: "Cheese Burger",
        description: "Classic cheese burger",
        price: "£4.99",
        image: "/images/menu/burger.webp"
      }
    ]
  },
  {
    name: "Meals",
    items: [
      {
        name: "2 Lamb Tikka Skewers",
        description: "With fresh naan, soup, drinks & salad",
        price: "£11.99",
        image: "/images/menu/menu.webp"
      },
      {
        name: "2 Chicken Kebab Skewers",
        description: "With fresh naan, soup, drinks & salad",
        price: "£9.99",
        image: "/images/menu/menu.webp"
      },
      {
        name: "1 Chicken Tikka 1 Lamb Kebab",
        description: "Mixed kebab with fresh naan and sides",
        price: "£10.99",
        image: "/images/menu/menu.webp"
      },
      {
        name: "2 Grilled Pork Skewers",
        description: "With fresh naan, soup, drinks & salad",
        price: "£8.99",
        image: "/images/menu/menu.webp"
      },
      {
        name: "1 Lamb 1 Chicken 1 Pork Skewers",
        description: "Mixed skewers with sides",
        price: "£9.99",
        image: "/images/menu/menu.webp"
      }
    ]
  },
  {
    name: "Pork Roast Meals",
    items: [
      {
        name: "Roast Pork with Crackling Skin",
        description: "Crispy roasted pork with perfect crackling",
        price: "£9.99",
        image: "/images/menu/menu.webp"
      },
      {
        name: "Roast Pork Adobo (Garlic)",
        description: "Filipino-style garlic pork adobo",
        price: "£9.99",
        image: "/images/menu/menu.webp"
      },
      {
        name: "Roast Pork Ribs BBQ",
        description: "Sauce sweet and spicy",
        price: "£10.99",
        image: "/images/menu/menu.webp"
      },
      {
        name: "Roast Pork Ribs",
        description: "Classic roasted pork ribs",
        price: "£10.99",
        image: "/images/menu/menu.webp"
      }
    ]
  }
]; 