// UI.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * TouchableField Component
 */
export const TouchableField: React.FC<{
    icon: string;
    placeholder: string;
    value: string;
    label: string;
    onPress: () => void;
}> = ({ icon, placeholder, label, value, onPress }) => (
    <TouchableOpacity style={styles.fieldContainer} onPress={onPress}>
        <MaterialCommunityIcons
            name={icon}
            size={20}
            color="#333"
            style={styles.icon}
        />
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.fieldText, !value && styles.placeholderText]}>
            {value || placeholder}
        </Text>
    </TouchableOpacity>
);

/**
 * SegmentedButtons Component
 */
export const SegmentedButtons: React.FC<{
    options: string[];
    selected: string;
    onSelect: (opt: string) => void;
}> = ({ options, selected, onSelect }) => (
    <View style={styles.segmentContainer}>
        {options.map(opt => (
            <TouchableOpacity
                key={opt}
                style={[
                    styles.segmentButton,
                    selected === opt && styles.segmentButtonActive,
                ]}
                onPress={() => onSelect(opt)}>
                <Text
                    style={
                        selected === opt ? styles.segmentTextActive : styles.segmentText
                    }>
                    {opt}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

/**
 * SearchButton Component
 */
export const SearchButton: React.FC<{
    title: string;
    onPress: () => void;
    icon: string;
}> = ({ title, onPress, icon }) => (
    <TouchableOpacity style={styles.searchButton} onPress={onPress}>
        <MaterialCommunityIcons
            name={icon}
            size={24}
            color="#fff"
            style={styles.searchIcon}
        />
        <Text style={styles.searchText}>{title}</Text>
    </TouchableOpacity>
);

/**
 * InputField Component
 */
export const InputWithLabel: React.FC<{
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    style?: any;
    multiline?: boolean;
    numberOfLines?: number;
    secureTextEntry?: boolean;
}> = ({ placeholder, value, onChangeText, style, multiline, numberOfLines, secureTextEntry }) => (
    <View style={[styles.inputContainer, style]}>
        <TextInput
            style={styles.inputField}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
            numberOfLines={numberOfLines}
            secureTextEntry={secureTextEntry}
        />
    </View>
);

/**
 * SearchButton Component
 */
export const SendButton: React.FC<{
    title: string;
    onPress: () => void;
}> = ({ title, onPress}) => (
    <TouchableOpacity style={styles.SendButton} onPress={onPress}>
        <Text style={styles.sendText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
        marginVertical: 6,
    },
    fieldIcon: {
        color: '#555',
        marginRight: 10,
    },
    fieldText: {
        fontSize: 16,
        color: '#2c2a2a',
        fontFamily: 'Nunito',
        fontWeight: 'bold',
    },
    placeholderText: {
        color: '#929292',
        fontFamily: 'Nurito',
        fontWeight: 'normal',
    },
    segmentContainer: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 6,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        backgroundColor: '#e1e6ed',
    },
    segmentButtonActive: {
        backgroundColor: '#393e64',
    },
    segmentText: {
        fontSize: 14,
        color: '#2c2a2a',
        fontFamily: 'Nurito',
    },
    segmentTextActive: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Nurito',
    },
    searchButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1b204b',
        paddingVertical: 14,
        borderRadius: 30,
        marginVertical: 20,
    },
    searchIcon: {
        marginRight: 8,
        marginTop: 1,
        marginBottom: 0,
    },
    searchText: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'Nunito',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        color: '#929292',
        fontFamily: 'Nurito',
        marginLeft: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        //alignItems: "center",
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 1, // Increased padding for better touch area
        backgroundColor: '#fff',
        marginVertical: 10,
    },
    inputField: {
        fontSize: 16,
        color: '#2c2a2a',
        fontFamily: 'Nunito',
        fontWeight: 'bold',
        flex: 1, // Allow the input field to take up available space
        paddingHorizontal: 10, // Add padding to the input field itself
    },
    multiline: {
        alignItems: "flex-start",
    },
    SendButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1b204b',
        paddingVertical: 14,
        borderRadius: 30,
        marginVertical: 20,
    },
    sendText: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'Nunito',
        fontWeight: 'bold',
    }

});