import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { addToCart } from '../app/services/cartService';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';


export default function DishModal({ visible, dish, onClose, restaurant }) {
    const user = FIREBASE_AUTH.currentUser;
    const [qty, setQty] = useState(1);

    // Don’t render anything if dish is null
    if (!dish) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 justify-end bg-black/25">
                    <TouchableWithoutFeedback>
                        <View
                            className="bg-white rounded-t-3xl p-6"
                            style={{ height: '60%' }}
                        >
                            {/* Grab bar */}
                            <View className="items-center">
                                <View className="w-12 h-1.5 bg-gray-400 rounded-full mb-4" />
                            </View>

                            {/* Dish Image */}
                            <Image
                                source={{ uri: dish.imageUrl }}
                                className="w-full h-72 rounded-xl"
                            />

                            {/* Dish Details */}
                            <Text className="text-xl font-semibold mt-3">{dish.name}</Text>
                            <Text className="text-gray-500">{dish.description}</Text>
                            <Text className="text-lg font-bold mt-2">₹{dish.price}</Text>

                            {/* Quantity Selector */}
                            <View className="flex-row items-center mt-4 w-full justify-center">
                                <View className='flex-row gap-x-5 items-center'>
                                    <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))}>
                                        <Text className="text-2xl"><Ionicons name='remove-circle' size={35} color={'#9810fa'}/></Text>
                                    </TouchableOpacity>
                                    <Text className="text-xl">{qty}</Text>
                                    <TouchableOpacity onPress={() => setQty(qty + 1)}>
                                        <Text className="text-2xl"><Ionicons name='add-circle' size={35} color={'#9810fa'}/></Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Add to Cart Button */}
                            <TouchableOpacity
                                onPress={() => {
                                    addToCart({
                                        userId: user?.uid,
                                        restaurant,
                                        dish,
                                        quantity: qty,
                                    })
                                        .then(() => {
                                            setQty(1);
                                            onClose(); // Close modal after adding
                                        })
                                        .catch((err) => {
                                            alert(err.message); // e.g., "Items must be from one restaurant"
                                        });
                                }}
                                className="bg-success rounded-xl py-3 mt-6"
                            >
                                <Text className="text-center text-white font-semibold">
                                    Add {qty} • ₹{dish.price * qty}
                                </Text>
                            </TouchableOpacity>

                            {/* Cancel Button */}
                            <TouchableOpacity onPress={onClose} className="items-center mt-4">
                                <Text className="text-error font-extrabold">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
