import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Swiper, SwiperItem, Input } from '@tarojs/components'
import { AtSearchBar, AtAvatar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import http from "@/utils/axios/index";
import CLoading from '@/components/CLoading';
import CMusic from '@/components/CMusic'

import { songType } from '@/store/constants/commonType'
import {
  getRecommendPlayList,
  getRecommendDj,
  getRecommendNewSong,
  getRecommend,
  getSongInfo,
  updatePlayStatus
} from '@/store/actions/song'


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
  song: songType,
  counter: {
    num: number
  },
  recommendPlayList: Array<{
    id: number,
    name: string,
    picUrl: string,
    playCount: number
  }>,
  recommendDj: Array<{
    name: string,
    picUrl: string
  }>,
  recommendNewSong: any,
  recommend: any
}

type PageDispatchProps = {
  getRecommendPlayList: () => any,
  getRecommendDj: () => any,
  getRecommendNewSong: () => any,
  getRecommend: () => any,
  getSongInfo: (object) => any,
  updatePlayStatus: (object) => any
}

type PageOwnProps = {}

type PageState = {
  current: number,
  showLoading: boolean,
  bannerList: Array<{
    typeTitle: string,
    pic: string,
    targetId: number
  }>,
  searchValue: string
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
  state: any;
}

@connect(({ song }) => ({
  song: song,
  recommendPlayList: song.recommendPlayList,
  recommendDj: song.recommendDj,
  recommendNewSong: song.recommendNewSong,
  recommend: song.recommend
}), (dispatch) => ({
  getRecommendPlayList() {
    dispatch(getRecommendPlayList())
  },
  getRecommendDj() {
    dispatch(getRecommendDj())
  },
  getRecommendNewSong() {
    dispatch(getRecommendNewSong())
  },
  getRecommend() {
    dispatch(getRecommend())
  },
  getSongInfo(object) {
    dispatch(getSongInfo(object))
  },
  updatePlayStatus(object) {
    dispatch(updatePlayStatus(object))
  }
}))
class Index extends Component {
  public tabs: any[] = [
    {
      imgurl: 'http://idlefish-autoui.oss-cn-hangzhou.aliyuncs.com/aliyun_k8s%2Fai_image%2F42d419f31bbbb2e13392aad0a81d97e3.png',
      name: '每日推荐',
      type: 'day'
    },
    {
      imgurl: 'http://idlefish-autoui.oss-cn-hangzhou.aliyuncs.com/aliyun_k8s%2Fai_image%2F0fbd7a5dc24e8b32f9a8e01e95f6b3d1.png',
      name: '歌单',
      type: 'song'
    },
    {
      imgurl: 'http://idlefish-autoui.oss-cn-hangzhou.aliyuncs.com/aliyun_k8s%2Fai_image%2F08924de0749985d9cbbf0769e1c67685.png',
      name: '排行榜',
      type: 'ranking'
    },
    {
      imgurl: 'http://idlefish-autoui.oss-cn-hangzhou.aliyuncs.com/aliyun_k8s%2Fai_image%2Ff999014a7aa55df0604d8e3b9faf052a.png',
      name: '电台',
      type: 'broadcasting'
    },
    {
      imgurl: 'http://idlefish-autoui.oss-cn-hangzhou.aliyuncs.com/aliyun_k8s%2Fai_image%2Fbac8c9b63ed6b6f2c3df6fe5e6de5cab.png',
      name: '直播',
      type: 'live'
    }
  ]

  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  config: Config = {
    navigationBarTitleText: '音乐'
  }

  constructor(props) {
    super(props)
    this.state = {
      showLoading: true,
      searchValue: ''
    }
  }


  componentWillMount() {
    this.initData();
    this.getBanner();
  }
  componentDidMount() {
    this.removeLoading();
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
    this.setState({
      showLoading: false
    })
  }

  componentWillUnmount() {
  }

  componentDidShow() { }

  componentDidHide() { }
  //修改input val
  handleSearch = () => {
    Taro.navigateTo({
      url: `/pages/search/index`
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

  initData() {
    //获取推荐歌单
    this.props.getRecommendPlayList();
    //获取推荐新音乐
    this.props.getRecommendNewSong();
    //获取推荐电台
    this.props.getRecommendDj();
    //获取推荐节目
    this.props.getRecommend();
  }

  //去除loading
  removeLoading() {
    const { recommendPlayList, recommendDj } = this.props
    if (recommendPlayList.length || recommendDj.length) {
      this.setState({
        showLoading: false
      })
    }
  }
  render() {
    const { showLoading, bannerList, searchValue } = this.state
    const { recommendPlayList, song } = this.props

    return (
      <View className='yl-index'>
        {/* loading */}
        <CLoading fullPage={true} hide={!showLoading} />
        <CMusic songInfo={this.props.song} isHome={true} onUpdatePlayStatus={this.props.updatePlayStatus.bind(this)} />
        <View onClick = {this.handleSearch}>
          <AtSearchBar value={searchValue} onChange={this.handleSearch}   />
        </View>
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
          {/* 导航 */}
          <View className='yl-index__tab'>
            {
              this.tabs.map((item) =>
                <View className='yl-index__tab__list' key={item.type}>
                  <View className='yl-index__tab__list__icon-wrap'>
                    <AtAvatar image={item.imgurl} circle></AtAvatar>
                  </View>
                  <Text className='yl-index__tab__list__text'>{item.name}</Text>
                </View>
              )
            }
          </View>
          <View className="yl-index__recommend">
            <View className="yl-index__recommend__title">推荐歌单</View>
            <View className="yl-index__recommend__content">
              {
                recommendPlayList.map((item) => (
                  <View className="yl-index__recommend__item" key={item.id}>
                    <Image src={`${item.picUrl}?imageView&thumbnail=250x0`} className='yl-index__recommend__item__img' />
                    <View className='yl-index__recommend__item__num' >
                      <Text className='at-icon at-icon-sound'></Text>
                        {
                          item.playCount < 10000 ?
                            item.playCount :
                            `${Number(item.playCount / 10000).toFixed(0)}万`
                        }
                    </View>
                    <View className='yl-index__recommend__item__title'>{item.name}</View>
                  </View>
                ))
              }
            </View>
          </View>
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
