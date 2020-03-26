/* eslint-disable react/sort-comp */
import { ComponentClass } from 'react';
import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { AtSearchBar, AtTabs, AtTabsPane, AtIcon } from 'taro-ui';
import classnames from 'classnames';
import CLoading from '@/components/CLoading';
import { connect } from '@tarojs/redux';
import CMusic from '@/components/CMusic';
import CWhiteSpace from '@/components/CWhiteSpace';
import { injectPlaySong } from '@/utils/custom/decorators';
import { updateCanplayList, getSongInfo, updatePlayStatus } from '@/store/actions/song';
import { IProps, PageState } from './index.d';
// import { setKeywordInHistory, formatCount, formatNumber, formatTimeStampToTime } from '../../utils/common'
import $http from '@/utils/axios/index';
import { getStorageSync, setStorageSync, deepClone } from '@/utils/custom/global';
import Synthesize from './mods/synthesize/index';
import Song from './mods/song/index';
import Single from './mods/single/index';
import Videos from './mods/video/index';
import './index.scss';


interface Page {
    props: IProps
    state: PageState
}


@injectPlaySong()
@connect(({
    song
}) => ({
    song: song
}), (dispatch) => ({
    updateCanplayList (object) {
        dispatch(updateCanplayList(object));
    },
    getSongInfo (object) {
        dispatch(getSongInfo(object));
    },
    updatePlayStatus (object) {
        dispatch(updatePlayStatus(object));
    }
}))
class Page extends Component {

    config: Config = {
        navigationBarTitleText: '搜索'
    }


    private tabList: Array<{ title: string }> = [
        {
            title: '综合' // synthesize
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

    constructor (props) {
        super(props);
        const { keywords = 'a' } = this.$router.params;
        this.state = {
            keywords,
            show: false,
            activeTab: 0
        };
    }

    componentWillMount () {
        this.switchTab(3);
    }
    componentDidShow () { }
    componentDidHide () { }


    playSong (songId) {
        $http('/check/music', {
            id: songId
        }).then((res) => {
            if (res.success) {
                Taro.navigateTo({
                    url: `/pages/songDetail/index?id=${songId}`
                });
            } else {
                Taro.showToast({
                    title: res.data.message,
                    icon: 'none'
                });
            }
        });
    }

    goVideoDetail (id, type) {
        let apiUrl = '/video/url';
        if (type === 'mv') {
            apiUrl = '/mv/url';
        }
        $http(apiUrl, {
            id
        }).then(({ data }) => {
            console.log('data', data);
            if ((type === 'video' && data.urls && data.urls.length) || (type === 'mv' && data.data.url)) {
                Taro.navigateTo({
                    url: `/pages/videoDetail/index?id=${id}&type=${type}`
                });
            } else {
                Taro.showToast({
                    title: `该${type === 'mv' ? 'mv' : '视频'}暂无版权播放`,
                    icon: 'none'
                });
            }
        });

    }

    goPlayListDetail (item) {
        Taro.navigateTo({
            url: `/pages/playListDetail/index?id=${item.id}&name=${item.name}`
        });
    }

    showMore () {
        Taro.showToast({
            title: '暂未实现，敬请期待',
            icon: 'none'
        });
    }

    searchTextChange (val) {
        this.setState({
            keywords: val
        });
    }


    // 设置存储
    setHistoryStorage () {
        const keywords = this.state.keywords;
        if (keywords) {
            let historyList = getStorageSync('historyList') || [];
            if (historyList.length >= 5) {
                historyList.splice(0, 1, keywords);
            } else {
                historyList.unshift(keywords);
            }
            historyList = [...new Set(historyList)];
            setStorageSync('historyList', historyList);
        }
    }
    // 初始化组件
    initRender () {
        this.setState({
            show: false
        });
        setTimeout(() => {
            this.setState({
                show: true
            });
        }, 0);
    }

    showTip () {
        Taro.showToast({
            title: '正在开发，敬请期待',
            icon: 'none'
        });
    }

    switchTab (activeTab) {
        console.log('Page -> switchTab -> activeTab', activeTab);
        this.initRender();
        switch (activeTab) {
            case 0:
                break;
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
        });
    }

    render () {
        const { keywords, activeTab = 0, show } = this.state;
        console.log('render -> keywords', keywords);
        return (
            <View className={
                classnames({
                    'yl-searchResult': true,
                    hasMusicBox: !!this.props.song.currentSongInfo.name
                })
            }
            >
                <CMusic songInfo={this.props.song} onUpdatePlayStatus={this.props.updatePlayStatus.bind(this)} />
                <AtSearchBar actionName='搜一下' value={keywords} onChange={this.searchTextChange.bind(this)} onActionClick={this.switchTab.bind(this, 0)}
                  onConfirm={this.switchTab.bind(this, 0)}
                  className='yl-searchResult__input'
                />
                <View className='yl-searchResult__content'>
                    <AtTabs className='yl-searchResult__content__tabs' current={activeTab} scroll tabList={this.tabList} onClick={this.switchTab.bind(this)}>
                        <AtTabsPane current={activeTab} index={0} className='yl-sone'>
                            {show && activeTab === 0 ? <Synthesize onSwitchTab={this.switchTab} activeTab={activeTab} keywords={keywords} /> : null}
                        </AtTabsPane>
                        <AtTabsPane current={activeTab} index={1} className='yl-sone'>
                            {show && activeTab === 1 ? <Single onSwitchTab={this.switchTab} activeTab={activeTab} keywords={keywords} /> : null}
                        </AtTabsPane>
                        <AtTabsPane current={activeTab} index={2} className='yl-sone'>
                            {show && activeTab === 2 ? <Song onSwitchTab={this.switchTab} activeTab={activeTab} keywords={keywords} /> : null}
                        </AtTabsPane>
                        <AtTabsPane current={activeTab} index={3} className='yl-sone'>
                            {show && activeTab === 3 ? <Videos onSwitchTab={this.switchTab} activeTab={activeTab} keywords={keywords} /> : null}
                        </AtTabsPane>
                    </AtTabs>
                </View>
            </View>
        );
    }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Page as ComponentClass<IProps, PageState>;
