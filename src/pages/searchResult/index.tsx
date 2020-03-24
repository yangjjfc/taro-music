import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { AtSearchBar, AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import classnames from 'classnames'
import CLoading from '@/components/CLoading'
import { connect } from '@tarojs/redux'
import CMusic from '@/components/CMusic'
import CWhiteSpace from '@/components/CWhiteSpace'
import { injectPlaySong } from '@/utils/custom/decorators'
import { updateCanplayList, getSongInfo, updatePlayStatus } from '@/store/actions/song'
import { IProps, PageState } from './index.d';
// import { setKeywordInHistory, formatCount, formatNumber, formatTimeStampToTime } from '../../utils/common'
import $http from "@/utils/axios/index";
import { getStorageSync, setStorageSync, deepClone } from '@/utils/custom/global';
import Synthesize from './mods/synthesize/index';
import './index.scss'

const totalInfo:PageState['totalInfo']= {
  loading: true,
  noData: false,
  userListInfo: {
    users: [],
    more: false,
    moreText: ''
  },
  videoInfo: {
    videos: [],
    more: false,
    moreText: ''
  },
  playListInfo: {
    playLists: [],
    more: false,
    moreText: ''
  },
  songInfo: {
    songs: [],
    more: false,
    moreText: ''
  },
  albumInfo: {
    albums: [],
    more: false,
    moreText: ''
  },
  djRadioInfo: {
    djRadios: [],
    more: false,
    moreText: ''
  },
  artistInfo: {
    artists: [],
    more: false,
    moreText: ''
  },
  sim_query: {
    sim_querys: [],
    more: false
  }
}





interface Page {
  props: IProps;
  state: PageState;
}




@injectPlaySong()
@connect(({
  song
}) => ({
  song: song
}), (dispatch) => ({
  updateCanplayList(object) {
    dispatch(updateCanplayList(object))
  },
  getSongInfo(object) {
    dispatch(getSongInfo(object))
  },
  updatePlayStatus(object) {
    dispatch(updatePlayStatus(object))
  }
}))
class Page extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '搜索'
  }


  private tabList: Array<{ title: string }> = [
    {
      title: '综合' //synthesize
    },
    {
      title: '单曲'
    },
    {
      title: '歌单'
    },
    {
      title: '视频'
    },
    {
      title: '歌手'
    },
    {
      title: '专辑'
    },
    {
      title: '主播电台'
    },
    {
      title: '用户'
    },
    {
      title: 'MV'
    }
  ]

  constructor(props) {
    super(props)
    const { keywords } = this.$router.params
    this.state = {
      keywords,
      activeTab: 0,
      totalInfo: deepClone(totalInfo),
      userListInfo: {
        users: [],
        more: true,
      },
      videoInfo: {
        videos: [],
        more: true,
      },
      mvInfo: {
        mvs: [],
        more: true,
      },
      playListInfo: {
        playLists: [],
        more: true,
        moreText: ''
      },
      songInfo: {
        songs: [],
        more: true
      },
      albumInfo: {
        albums: [],
        more: true,
      },
      djRadioInfo: {
        djRadios: [],
        more: true,
      },
      artistInfo: {
        artists: [],
        more: true,
      },
      sim_query: []
    }
  }

  componentWillMount() {
    const { keywords } = this.state
    Taro.setNavigationBarTitle({
      title: `${keywords}的搜索结果`
    })
    this.getResult()
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() {
  }

  componentDidHide() { }

  //搜索结果
  getResult() {
    const { keywords = 1, totalInfo } = this.state
    Taro.setNavigationBarTitle({
      title: `${keywords}的搜索结果`
    })
    this.setState({
      totalInfo: Object.assign(totalInfo, {
        loading: true
      })
    })
    $http('/search', { keywords,  type: 1018 }).then((res) => {
      //无数据
      if (!res.result) {
        this.setState({
          totalInfo: Object.assign(this.state.totalInfo, {
            loading: false,
            noData: true
          })
        })
        return
      }
      const result = res.result
      if (result) {
        let noData = !result.album && !result.artist && !result.djRadio && !result.playList && !result.song && !result.user && !result.video && !result.sim_query;
        this.setState({
          totalInfo: {
            loading: false,
            noData,
            albumInfo: result.album || {
              albums: []
            },
            artistInfo: result.artist || {
              artists: []
            },
            djRadioInfo: result.djRadio || {
              djRadios: []
            },
            playListInfo: result.playList || {
              playLists: []
            },
            songInfo: result.song || {
              songs: []
            },
            userListInfo: result.user || {
              users: []
            },
            videoInfo: result.video || {
              videos: []
            },
            sim_query: result.sim_query || {
              sim_querys: []
            }
          }
        })
      }
    })
  }

  playSong(songId) {
    $http('/check/music', {
      id: songId
    }).then((res) => {
      if (res.success) {
        Taro.navigateTo({
          url: `/pages/songDetail/index?id=${songId}`
        })
      } else {
        Taro.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  }

  goVideoDetail(id, type) {
    let apiUrl = '/video/url'
    if (type === 'mv') {
      apiUrl = '/mv/url'
    }
    $http(apiUrl, {
      id
    }).then(({ data }) => {
      console.log('data', data)
      if ((type === 'video' && data.urls && data.urls.length) || (type === 'mv' && data.data.url)) {
        Taro.navigateTo({
          url: `/pages/videoDetail/index?id=${id}&type=${type}`
        })
      } else {
        Taro.showToast({
          title: `该${type === 'mv' ? 'mv' : '视频'}暂无版权播放`,
          icon: 'none'
        })
      }
    })

  }

  goPlayListDetail(item) {
    Taro.navigateTo({
      url: `/pages/playListDetail/index?id=${item.id}&name=${item.name}`
    })
  }

  showMore() {
    Taro.showToast({
      title: '暂未实现，敬请期待',
      icon: 'none'
    })
  }

  searchTextChange(val) {
    this.setState({
      keywords: val
    })
  }

  

  //设置存储
  setHistoryStorage() {
    let keywords = this.state.keywords
    if (keywords) {
      let historyList = getStorageSync('historyList')||[];
      if (historyList.length >= 5) {
        historyList.splice(0,1,keywords)
      } else {
        historyList.unshift(keywords);
      }
      historyList = [...new Set(historyList)];
      setStorageSync('historyList', historyList);
    }
  }
  //搜索
  searchResult() {
    this.setHistoryStorage();
    this.setState({
      totalInfo: Object.assign(this.state.totalInfo, {
        loading: true
      })
    }, () => {
      this.resetInfo();
      this.switchTab(0);
    })
  }
  //清空
  resetInfo() {
    this.setState({
      totalInfo: deepClone(totalInfo)
    })
  }
  queryResultBySim(keyword) {
    // setKeywordInHistory(keyword)
    this.setState({
      keywords: keyword
    }, () => {
      this.getResult()
    })
  }

  showTip() {
    Taro.showToast({
      title: '正在开发，敬请期待',
      icon: 'none'
    })
  }

  switchTab(activeTab) {
    console.log('activeTab', activeTab)
    switch (activeTab) {
      case 0:
        this.getResult()
        break
      // case 1:
      //   this.getSongList()
      //   break
      // case 2:
      //   this.getPlayList()
      //   break
      // case 3:
      //   this.getVideoList()
      //   break  
      // case 4:
      //   this.getArtistList()
      //   break  
      // case 5:
      //   this.getAlbumList()
      //   break    
      // case 6:
      //   this.getDjRadioList()
      //   break 
      // case 7:
      //   this.getUserList()
      //   break  
      // case 8:
      //   this.getMvList()
      //   break 
    }
    this.setState({
      activeTab
    })
  }

  formatDuration(ms: number) {
    // @ts-ignore
    let minutes: string = formatNumber(parseInt(ms / 60000))
    // @ts-ignore
    let seconds: string = formatNumber(parseInt((ms / 1000) % 60))
    return `${minutes}:${seconds}`
  }


  render() {
    const { keywords='1', activeTab=0, totalInfo } = this.state
    return (
      <View className={
        classnames({
          searchResult_container: true,
          hasMusicBox: !!this.props.song.currentSongInfo.name
        })
      }>
        <CMusic songInfo={this.props.song} onUpdatePlayStatus={this.props.updatePlayStatus.bind(this)} />
        <AtSearchBar
          actionName='搜一下'
          value={keywords}
          onChange={this.searchTextChange.bind(this)}
          onActionClick={this.searchResult.bind(this)}
          onConfirm={this.searchResult.bind(this)}
          className='search__input'
        />
        <View className='search_content'>
          <AtTabs current={activeTab} scroll tabList={this.tabList} onClick={this.switchTab.bind(this)}>
            {
              totalInfo.loading ? <CLoading /> : <Synthesize activeTab={activeTab} keywords={keywords}  />
            }
          </AtTabs>
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

export default Page as ComponentClass<IProps, PageState>
