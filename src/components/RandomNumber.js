import React, {Component} from 'react'
import {StyleSheet, Text, TouchableOpacity} from 'react-native'
import PropTypes from "prop-types"


export default class RandomNumber extends Component<{}> {
    static propTypes = {
        number: PropTypes.number.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        onPress: PropTypes.func.isRequired,
        id: PropTypes.number.isRequired
    }

    handlePress = () => {
        if (this.props.isDisabled) {
            return
        }
        this.props.onPress(this.props.id)
    }

    render() {
        return (
            <TouchableOpacity onPress={this.handlePress}>
                <Text style={[styles.target, this.props.isDisabled && styles.disabled]}>{this.props.number}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    target: {
        fontSize: 40,
        backgroundColor: '#aaa',
        marginHorizontal: 50,
        textAlign: 'center',
        marginTop: 20,
    },
    disabled: {
        opacity: .3
    }
})
