import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'


class Index extends Component {

    config: Config = {
        navigationBarTitleText: 'taro-music'
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props, nextProps)
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <View>
            </View>
        )
    }
}

export default Index as ComponentClass;
