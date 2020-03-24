import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { AtSearchBar, AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import classnames from 'classnames'
import CLoading from '@/components/CLoading'
import { connect } from '@tarojs/redux'
import CMusic from '@/components/CMusic'
import { updateCanplayList, getSongInfo, updatePlayStatus } from '@/store/actions/song'
import $http from "@/utils/axios/index";
import './index.scss'





class Page extends Component {

  constructor (props) {
    super(props)
    const { keywords } = this.$router.params
    this.state = {}
  }

  componentWillMount() {
    
  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  componentDidShow () {
   }

  componentDidHide () { }
  
  

 

  

  render () {
    return (
       <View></View>
      )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Page as ComponentClass;
