import React, { useState } from 'react';
import { Modal, View, Text, Image, TouchableOpacity } from 'react-native';
import { addToCart } from '../services/cartService';
import { FIREBASE_AUTH } from '../FirebaseConfig';

export default function DishModal({ visible, dish, onClose, restaurant }) {

    const user = FIREBASE_AUTH.currentUser;


    const [qty, setQty] = useState(1);

    if (!dish) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1  justify-end">
                <View className="bg-white rounded-t-3xl p-6 max-h-[75%]">
                    <Image source={{ uri: dish.imageUrl }} className="w-full h-48 rounded-xl" />
                    <Text className="text-xl font-semibold mt-3">{dish.name}</Text>
                    <Text className="text-gray-500">{dish.description}</Text>
                    <Text className="text-lg font-bold mt-2">₹{dish.price}</Text>

                    {/* simple qty selector */}
                    <View className="flex-row items-center mt-4 space-x-4">
                        <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))}>
                            <Text className="text-2xl">−</Text>
                        </TouchableOpacity>
                        <Text className="text-xl">{qty}</Text>
                        <TouchableOpacity onPress={() => setQty(qty + 1)}>
                            <Text className="text-2xl">＋</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            addToCart({
                                userId: user.uid,
                                restaurant,     // { id, name, … }
                                dish,           // { id, name, price, … }
                                quantity: qty,
                            })
                                .then(() => {
                                    setQty(1);
                                    onClose();    // close modal
                                })
                                .catch(err => {
                                    alert(err.message);   // show “another restaurant” error, etc.
                                });
                        }} className="bg-purple-600 rounded-xl py-3 mt-6"
                    >
                        <Text className="text-center text-white font-semibold">
                            Add {qty} • ₹{dish.price * qty}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} className="items-center mt-4">
                        <Text className="text-purple-600">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
