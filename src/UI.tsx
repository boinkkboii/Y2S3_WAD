import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * InputWithLabel
 */
export const InputWithLabel = (props: any) => {

    const orientationDirection = (props.orientation == 'horizontal') ? 'row' : 'column';

    return (
        <View style={[inputStyles.container, { flexDirection: orientationDirection }]}>
            <Text style={inputStyles.label}>{props.label}</Text>
            <TextInput
                style={[inputStyles.input, props.style]}
                {...props}
            />
        </View>
    );
}


/**
 * AppButton
 */
export const AppButton = (props: any) => {

    let backgroundColorTheme = '';

    if (props.theme) {
        switch (props.theme) {
            case 'success':
                backgroundColorTheme = '#449d44';
                break;
            case 'info':
                backgroundColorTheme = '#31b0d5';
                break;
            case 'warning':
                backgroundColorTheme = '#ec971f';
                break;
            case 'danger':
                backgroundColorTheme = '#c9302c';
                break;
            case 'primary':
                backgroundColorTheme = '#60717d';
                break;
            default:
                backgroundColorTheme = '#286090';
        }
    }
    else {
        backgroundColorTheme = '#286090';
    }

    return (
        <TouchableNativeFeedback
            onPress={props.onPress}
            onLongPress={props.onLongPress}
        >
            <View style={[buttonStyles.button, { backgroundColor: backgroundColorTheme }]}>
                <Text style={buttonStyles.buttonText}>{props.title}</Text>
            </View>
        </TouchableNativeFeedback>
    )
}

/**
 * PickerWithLabel
 */
export const PickerWithLabel = (props: any) => {

    const orientationDirection = (props.orientation == 'horizontal') ? 'row' : 'column';

    return (
        <View style={[inputStyles.container, { flexDirection: orientationDirection }]}>
            <Picker
                style={[inputStyles.input, props.orientation === 'horizontal' && { flex: 3 }]}
                {...props}
            >
                {props.items.map((item: any) => {
                    return (
                        <Picker.Item
                            label={item.value}
                            value={item.key}
                            key={item.key}
                        />
                    );
                })}
            </Picker>
        </View>
    );
}

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
        <MaterialCommunityIcons name={icon} size={20} color="#333" style={styles.icon} />
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
                onPress={() => onSelect(opt)}
            >
                <Text
                    style={
                        selected === opt ? styles.segmentTextActive : styles.segmentText
                    }
                >
                    {opt}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

/**
 * SearchButton Component
 */
export const SearchButton: React.FC<{ title: string; onPress: () => void, icon: string }> = ({
    title,
    onPress,
    icon,
}) => (
    <TouchableOpacity style={styles.searchButton} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={24} color="#fff" style={styles.searchIcon} />
        <Text style={styles.searchText}>{title}</Text>
    </TouchableOpacity>
);

const buttonStyles = StyleSheet.create({
    button: {
        margin: 5,
        alignItems: 'center',
    },
    buttonText: {
        padding: 20,
        fontSize: 20,
        color: 'white',
    },
});

const inputStyles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 4,
    },
});

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
});