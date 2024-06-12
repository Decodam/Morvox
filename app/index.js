import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Vibration } from 'react-native';
import * as Speech from 'expo-speech';


const App = (props) => {
    const [Decipher, setDecipher] = useState("");
    const [Input, setInput] = useState("");
    const [Word, setWord] = useState("");


    const MORSE_CODE = {
        'A': '01', 'B': '1000', 'C': '1010', 'D': '100', 'E': '0',
        'F': '0010', 'G': '110', 'H': '0000', 'I': '00', 'J': '0111',
        'K': '101', 'L': '0100', 'M': '11', 'N': '10', 'O': '111',
        'P': '0110', 'Q': '1101', 'R': '010', 'S': '000', 'T': '1',
        'U': '001', 'V': '0001', 'W': '011', 'X': '1001', 'Y': '1011',
        'Z': '1100', '1': '01111', '2': '00111', '3': '00011',
        '4': '00001', '5': '00000', '6': '10000', '7': '11000',
        '8': '11100', '9': '11110', '0': '11111',
    };

    const updateWord = () => {
        let binaryInput = Input;
        let translatedWord = '';
        
        // Split the binary input into letters based on '/'
        const letters = binaryInput.split('/');
    
        // Iterate through each letter
        for (let i = 0; i < letters.length; i++) {
            // Find the corresponding letter in the MORSE_CODE table
            const letter = Object.keys(MORSE_CODE).find(key => MORSE_CODE[key] === letters[i]);
            
            if (letter) {
                // If a matching letter is found, add it to the translated word
                translatedWord += letter;
            } else {
                // If no matching letter is found, remove the letter
                translatedWord += '';
            }
        }
        
        setWord(translatedWord);
        return 1;
    };

    const AddInput = (input) => {
        Vibration.vibrate(50);
    
        if (input === '/') {
            // Check if there are other letters than '/' and if two '/' are side by side
            const containsLetters = Input.replace(/\//g, '').length > 0;        
            const lastInputIsSlash = Input.charAt(Input.length - 1) === '/';

    
            if (containsLetters && !lastInputIsSlash) {
                setInput(prevInput => prevInput + '/');
            } else {
                setInput(prevInput => prevInput);
            }
        } else {
            setInput(prevInput => prevInput + input);
        }
    };
    
    const addWord = () => {
        // Add the current word to Decipher
        setDecipher(prevDecipher => {
            return prevDecipher + ' ' + Word; 
        });
    
        // Reset Word and Input
        setWord("");
        setInput("");
    };

    const removeInput = () => {
        setInput(prevInput => {
            let newInput = prevInput;
            if (newInput.endsWith('/')) {
                // If the last character is '/', remove characters until the next '/'
                const index = newInput.lastIndexOf('/', newInput.length - 2);
                newInput = newInput.slice(0, index + 1); // Include the '/' // Call updateWord to update the Word state
            } else {
                newInput = newInput.slice(0, -1); // Simply remove the last character
            }
            return newInput;
        });
    };

    

    const resetInput = () => {
        setDecipher("");
        setInput("");
        setWord("");
        
        Vibration.vibrate(800);
    }

    const scrollViewRef = useRef(null);

    // Function to automatically scroll to the end of the ScrollView
    const scrollToBottom = () => {
        scrollViewRef.current.scrollToEnd({ animated: true });
    };

    // Effect to scroll to bottom whenever decipher text changes
    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        updateWord();
    }, [Input]);

    const speechFunc = () => {
        if (Decipher !== "") {
            Speech.speak(Decipher);
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.controlGroup}>

                <TouchableOpacity onPress={() => {AddInput(1)}} style={styles.controlSectionButtton}>
                    <Text style={styles.buttonText}>1</Text>
                </TouchableOpacity>

                <View style={styles.controlSection}>

                    {/* Code Input */}

                    <ScrollView style={{flex: 1}} >
                        <Text style={{color: "red", textAlign: "center", fontSize: 32, fontWeight: "bold"}}>{Input ? Input : "MORSE"}</Text>
                    </ScrollView>


                    {/* Reset and Remove */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={resetInput} style={{backgroundColor: "red", ...styles.controlSectionButttonSM}}>
                            <Text style={styles.buttonTextSM}>RES</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={removeInput} style={{backgroundColor: "orange", ...styles.controlSectionButttonSM}}>
                            <Text style={styles.buttonTextSM}>RMV</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Word Input */}


                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "red", textAlign: "center", fontSize: 36, fontWeight: "bold"}}>{Word ? Word : "WORD"}</Text>
                    </View>

                    {/* Decipher and Execute */}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={addWord} style={{backgroundColor: "skyblue", ...styles.controlSectionButttonSM}}>
                            <Text style={styles.buttonTextSM}>ADD</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={speechFunc} style={{backgroundColor: "maroon", ...styles.controlSectionButttonSM}}>
                            <Text style={styles.buttonTextSM}>DEC</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {AddInput('/')}} style={{backgroundColor: "olive", ...styles.controlSectionButttonSM}}>
                            <Text style={styles.buttonTextSM}>EXC</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity onPress={() => {AddInput(0)}} style={styles.controlSectionButtton}>
                    <Text style={styles.buttonText}>0</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.displayGroup}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    contentContainerStyle={styles.scrollView}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.displayText}>{Decipher ? Decipher : "Ready..."}</Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    displayGroup: {
        height: 40,
        backgroundColor: '#222',
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    displayText: {
        fontSize: 18,
        textAlign: "right",
        color: "#fff"
    },
    controlGroup: {
        flex: 1,
        flexDirection: 'row',
    },
    controlSection: {
        flex: 1,
        backgroundColor: "#000"
    },
    scrollView: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: "flex-end"
    },
    controlSectionButtton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111"
    },
    buttonText: {
        fontSize: 82,
        fontWeight: "bold",
        color: "#fff"
    },
    buttonTextSM: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff"
    },
    buttonRow: {
        flexDirection: "row" 
    },
    controlSectionButttonSM: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 60
    }
});
