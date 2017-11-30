/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react'
import {Button, StyleSheet, Text, View} from 'react-native'
import PropTypes from "prop-types"
import RandomNumber from './RandomNumber'
import shuffle from 'lodash.shuffle'

export default class Game extends Component<{}> {
    static propTypes = {
        randomNumberCount: PropTypes.number.isRequired,
        initialSeconds: PropTypes.number.isRequired,
        onPlayAgain: PropTypes.func.isRequired
    }
    state = {
        selectedIds: [],
        remainingSeconds: this.props.initialSeconds,
    }
    gameStatus = 'PLAYING'
    randomNumbers = Array
        .from({length: this.props.randomNumberCount})
        .map(() => 1 + Math.floor(10 * Math.random()))
    target = this.randomNumbers
        .slice(0, this.props.randomNumberCount - 2)
        .reduce((acc, curr) => acc + curr, 0)

    shuffleRandomNumbers = shuffle(this.randomNumbers)

    componentDidMount(){
        this.intervalID = setInterval(()=>{
            this.setState((prevState) => {
                return { remainingSeconds: prevState.remainingSeconds - 1 }
            }, ()=>{
                if(this.state.remainingSeconds === 0){
                    clearInterval(this.intervalID)
                }
            })
        }, 1000)
    }


    componentWillUnmount(){
        clearInterval(this.intervalID)
    }

    isNumberSelected = (numberIndex) => {
        return this.state.selectedIds.indexOf(numberIndex) >= 0;
    }
    selectNumber = (numberIndex) => {
        this.setState((prevState) => ({
            selectedIds: [...prevState.selectedIds, numberIndex]
        }))
    }
    componentWillUpdate(nextProps, nextState){
        if(nextState.selectedIds !== this.state.selectedIds
            || nextState.remainingSeconds === 0){
            this.gameStatus = this.calcGameStatus(nextState)
            if (this.gameStatus !== 'PLAYING'){
                clearInterval(this.intervalID)
            }
        }
    }
    calcGameStatus = (nextState) =>{
        const sumSelected = nextState.selectedIds.reduce((acc, curr) =>{
            return acc + this.shuffleRandomNumbers[curr]
        }, 0)
        console.log(sumSelected)
        if(nextState.remainingSeconds === 0){
            return 'LOST'
        }
        if(sumSelected < this.target){
            return 'PLAYING'
        }
        if(sumSelected === this.target){
            return 'WON'
        }
        if(sumSelected > this.target){
            return 'LOST'
        }
    }

    render() {
        const gameStatus = this.gameStatus
        return (
            <View style={styles.container}>
                <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
                {this.shuffleRandomNumbers.map((randomNumber, index) =>
                    <RandomNumber
                        style={styles.target}
                        id={index}
                        key={index} number={randomNumber}
                        isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'}
                        onPress={this.selectNumber}
                    />
                )}
                <Text>{gameStatus}</Text>
                <Text>{this.state.remainingSeconds}</Text>
                {this.gameStatus !== 'PLAYING' && (
                    <Button title="Play Again" onPress={this.props.onPlayAgain}/>
                )}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ddd',
        flex: 1,
        paddingTop: 30
    },

    target: {
        fontSize: 40,
        marginHorizontal: 50,
        textAlign: 'center',
        marginTop: 20
    },
    STATUS_PLAYING:{
        backgroundColor: '#aaa',
    },
    STATUS_WON: {
        backgroundColor: 'green',
    },
    STATUS_LOST: {
        backgroundColor: 'red',
    },

})
