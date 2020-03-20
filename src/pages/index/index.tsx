import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Swiper, SwiperItem, Input } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import http from "@/utils/axios/index";

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.scss'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  counter: {
    num: number
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
  state: any;
}

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add() {
    dispatch(add())
  },
  dec() {
    dispatch(minus())
  },
  asyncAdd() {
    dispatch(asyncAdd())
  }
}))
class Index extends Component {

  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  constructor(props) {
    super(props)
    this.state = {
      searchValue: ''
    }
  }

  //搜索
  handleTopSearch = (value) => {
    console.log("Index -> handleTopSearch -> this.state.searchValue", this.state.searchValue)
  }
  //修改input val
  changeVal = (value) => {
    this.setState({
      bannerList: [],
      searchValue: value
    })
  }
  //获取banner
  getBanner = () => {
    http('/banner', {
      type: 2
    }).then(res => {
      if (res.banners) {
        this.setState({
          bannerList: res.banners
        })
      }
    })
  }
  componentWillMount() {
    this.getBanner();
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() {
  }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { showLoading, bannerList, searchValue } = this.state

    return (
      <View className='yl-index'>
        <AtSearchBar value={searchValue} onChange={this.changeVal} onConfirm={this.handleTopSearch} />
        <View className="yl-index__content">
          <Swiper className='yl-index__banner' indicatorColor='#999' indicatorActiveColor='#333' circular indicatorDots autoplay>
            {
              bannerList.map((item) =>
                <SwiperItem key={item.targetId} className='yl-index__banner__item'>
                  <Image src={item.pic} className='yl-index__banner__item__img' />
                </SwiperItem>
              )
            }
          </Swiper>
        </View>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
