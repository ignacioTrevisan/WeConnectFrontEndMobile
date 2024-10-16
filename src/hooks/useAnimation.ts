import React, { useRef } from 'react'
import { Animated, Easing } from 'react-native';

export const useAnimations = () => {

    const animatedOpacity = useRef(new Animated.Value(0)).current;
    const animatedTop = useRef(new Animated.Value(-100)).current;
    const animatedRigth = useRef(new Animated.Value(-100)).current;
    const animatedWidth = useRef(new Animated.Value(150)).current;


    const ChangeWidth = ({ duration = 300, toValue = 300, callback = () => { } }) => {
        Animated.timing(animatedWidth, {
            toValue,
            duration: duration,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (!finished) {
                console.log("Animation did not finish!");
            }
        });
    }
    const fadeIn = ({ duration = 300, toValue = 1, callback = () => { } }) => {
        Animated.timing(animatedOpacity,
            {
                toValue: toValue,
                duration: duration,
                useNativeDriver: true
            }).start(callback)
    }
    const fadeOut = ({ duration = 300, toValue = 1, callback = () => { } }) => {
        Animated.timing(animatedOpacity,
            {
                toValue: toValue,
                duration: duration,
                useNativeDriver: true
            }).start(callback)

    }

    const moveTop = ({ duration = 300, toValue = 0, initialValue = 0, callback = () => { } }) => {
        animatedTop.setValue(initialValue)
        Animated.timing(animatedTop, {
            toValue: toValue, duration: duration, useNativeDriver: true,
            easing: Easing.elastic(1)
        }).start(callback)
    }
    const moveRigth = ({ duration = 300, toValue = 0, initialValue = 0, callback = () => { } }) => {
        animatedRigth.setValue(initialValue)
        Animated.timing(animatedRigth, {
            toValue: toValue, duration: duration, useNativeDriver: true,
            easing: Easing.elastic(1)
        }).start(callback)
    }


    //Personales de cada app


    const animatedBottonOpacidad = useRef(new Animated.Value(0)).current;
    const animatedBottonUbicacion = useRef(new Animated.Value(10)).current;

    const AnimarBoton = ({ duration = 1000, toValue = 1 }) => {
        Animated.timing(animatedBottonOpacidad,
            {
                toValue: toValue,
                duration: duration,
                useNativeDriver: true
            }).start(() => { })
        Animated.timing(animatedBottonUbicacion,
            {
                toValue: 0,

                duration: duration,
                useNativeDriver: true
            }).start(() => { })
    }


    return {

        animatedOpacity,
        animatedTop,
        animatedRigth,
        animatedWidth,
        animatedBottonOpacidad,
        animatedBottonUbicacion,
        //methods
        AnimarBoton,
        moveTop,
        fadeIn,
        fadeOut,
        moveRigth,
        ChangeWidth
    }
}
