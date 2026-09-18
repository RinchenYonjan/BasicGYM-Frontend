import { createContext, ReactNode, useContext, useState } from "react";


export type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: any; // or string uri
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, type: "increase" | "decrease") => void;
  removeItem: (id: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);


export function CartProvider({ children }: { children: ReactNode }) {

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart: CartContextType["addToCart"] = (item, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }

      return [...prev, { ...item, quantity }];
    });
    
  };

  const updateQuantity = (id: string, type: "increase" | "decrease") => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          quantity:
            type === "increase"
              ? item.quantity + 1
              : Math.max(1, item.quantity - 1),
        };
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );

}


export function useCart() {

  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;

}