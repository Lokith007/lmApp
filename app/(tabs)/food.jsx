import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const GET_CART = gql`
  query GetCart($userId: String!) {
    getCart(userId: $userId) {
      id
      items {
        dishId
        name
        price
        quantity
      }
      totalAmount
    }
  }
`;

const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($userId: String!, $dishId: String!, $delta: Int!) {
    updateCartItem(userId: $userId, dishId: $dishId, delta: $delta) {
      id
      items {
        dishId
        name
        price
        quantity
      }
      totalAmount
    }
  }
`;

export default function CartScreen() {
  const user = FIREBASE_AUTH.currentUser;

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600 text-lg">Please log in to view your cart.</Text>
      </View>
    );
  }

  const { data, refetch } = useQuery(GET_CART, {
    variables: { userId: user.uid },
  });

  // inside CartScreen.jsx (imports unchanged)
  const [updateCart, { loading: updating, error: updateError }] = useMutation(
    UPDATE_CART_ITEM,
    {
      onError: (err) => {
        console.log("UPDATE_CART_ITEM error:", err);
      },
      // update cache with returned cart (avoid a full refetch)
      update: (cache, { data }) => {
        const updatedCart = data?.updateCartItem;
        if (!updatedCart) {
          // cart deleted -> remove from cache
          cache.writeQuery({
            query: GET_CART,
            variables: { userId: user.uid },
            data: { getCart: null },
          });
          return;
        }

        cache.writeQuery({
          query: GET_CART,
          variables: { userId: user.uid },
          data: { getCart: updatedCart },
        });
      },
    }
  );

  // helper used in UI
  const changeQty = (dishId, delta) => {
    if (!user?.uid) return;
    updateCart({
      variables: { userId: user.uid, dishId, delta },
      // optional optimistic UI (quick feedback)
      optimisticResponse: {
        updateCartItem: (() => {
          const current = data?.getCart;
          if (!current) return null;
          const items = current.items.map(it =>
            it.dishId === dishId ? { ...it, quantity: it.quantity + delta } : it
          ).filter(it => it.quantity > 0);
          const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);
          return { id: current.id, items, totalAmount, __typename: "Cart" };
        })()
      }
    });
  };


  if (!data?.getCart?.items?.length) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600 text-lg">Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={data.getCart.items}
        keyExtractor={(item) => item.dishId}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between bg-white rounded-xl p-4 mb-3 shadow-sm">
            <View>
              <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
              <Text className="text-sm text-gray-500">₹{item.price}</Text>
            </View>

            <View className="flex-row items-center space-x-4">
              <TouchableOpacity onPress={() => changeQty(item.dishId, -1)}
                className="bg-gray-200 rounded-full px-3 py-1"
              >
                <Text className="text-lg font-bold text-gray-700">-</Text>
              </TouchableOpacity>

              <Text className="text-lg font-medium text-gray-800">{item.quantity}</Text>

              <TouchableOpacity onPress={() => changeQty(item.dishId, 1)}
                className="bg-green-500 rounded-full px-3 py-1"
              >
                <Text className="text-lg font-bold text-white">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Total Amount Bar */}
      <View className="bg-white p-4 border-t border-gray-200">
        <View className="flex-row justify-between">
          <Text className="text-lg font-semibold text-gray-700">Total</Text>
          <Text className="text-lg font-bold text-green-600">
            ₹{data.getCart.totalAmount}
          </Text>
        </View>
        <TouchableOpacity className="bg-green-600 py-3 mt-3 rounded-lg">
          <Text className="text-center text-white font-semibold text-lg">Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
