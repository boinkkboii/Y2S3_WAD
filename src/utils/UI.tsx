// UI.tsx
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Platform,
    TouchableNativeFeedback
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
 * InputWithLabel Component
 */
export const InputWithLabel: React.FC<{
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
    numberOfLines?: number;
    secureTextEntry?: boolean;
    style?: any;
}> = ({
    label,
    placeholder,
    value,
    onChangeText,
    multiline = false,
    numberOfLines = 1,
    secureTextEntry = false,
    style
}) => (
    <View style={[styles.inputContainer, style]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
            style={[styles.inputField, multiline && styles.multiline]}
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
 * PickerWithLabel Component
 */
export const PickerWithLabel: React.FC<{
    label: string;
    selectedValue: string;
    onValueChange: (itemValue: string) => void;
    items: { label: string; value: string; enabled?: boolean }[]; // Corrected item shape
}> = ({ label, selectedValue, onValueChange, items }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerWrapper}>
            <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                style={styles.picker}>
                {items.map((item, index) => (
                    <Picker.Item
                        key={index}
                        label={item.label}
                        value={item.value}
                        enabled={item.enabled !== false} // optional check for disabling
                    />
                ))}
            </Picker>
        </View>
    </View>
);

/**
 * AppButton Component
 */
export const AppButton: React.FC<{
    title: string;
    onPress: () => void;
    theme?: 'default' | 'success' | 'warning' | 'danger';
}> = ({ title, onPress, theme = 'default' }) => {
    const backgroundColor = {
        default: '#1b204b',
        success: '#4caf50',
        warning: '#ff9800',
        danger: '#f44336',
    }[theme];

    const content = (
        <View style={[styles.appButtonContainer, { backgroundColor }]}>
            <Text style={styles.sendText}>{title}</Text>
        </View>
    );

    return Platform.OS === 'android' ? (
        <TouchableNativeFeedback onPress={onPress}>
            {content}
        </TouchableNativeFeedback>
    ) : (
        <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>
    );
};

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
    icon: {
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        color: '#929292',
        fontFamily: 'Nunito',
        marginLeft: 10,
    },
    fieldText: {
        fontSize: 16,
        color: '#2c2a2a',
        fontFamily: 'Nunito',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    placeholderText: {
        color: '#929292',
        fontFamily: 'Nunito',
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
        fontFamily: 'Nunito',
    },
    segmentTextActive: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Nunito',
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
    },
    searchText: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'Nunito',
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        backgroundColor: '#fff',
        marginVertical: 10,
    },
    inputField: {
        fontSize: 16,
        color: '#2c2a2a',
        fontFamily: 'Nunito',
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    multiline: {
        textAlignVertical: 'top',
    },
    appButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 30,
        marginVertical: 20,
        marginHorizontal: 10,
    },
    sendText: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'Nunito',
        fontWeight: 'bold',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginTop: 6,
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#2c2a2a',
        fontFamily: 'Nunito',
    },
});