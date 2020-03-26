import { ComponentClass } from 'react';
import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { AtTabsPane, AtIcon } from 'taro-ui';
import classnames from 'classnames';
import CLoading from '@/components/CLoading';
import { connect } from '@tarojs/redux';
import CMusic from '@/components/CMusic';
import { PageState, InitProps } from './index.d';
import { getStorageSync, setStorageSync, deepClone } from '@/utils/custom/global';
import { formatNumber, formatCount, formatTimeStampToTime } from '@/utils/custom/common';

import { updateCanplayList, getSongInfo, updatePlayStatus } from '@/store/actions/song';
import $http from '@/utils/axios/index';
import './index.scss';


class Page extends Component {
    static defaultProps = {
        keywords: ''
    }
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            noData: true,
            songInfo: {
                songs: [],
                more: true
            }
        };
    }

    componentWillMount () {
        this.getSongList();
    }

    componentWillReceiveProps (nextProps) {
    }

    componentWillUnmount () { }

    componentDidShow () {
    }

    componentDidHide () { }


    getSongList () {
        const { keywords } = this.props;
        Taro.setNavigationBarTitle({
            title: `${keywords}的搜索结果`
        });
        const { songInfo } = this.state;
        if (!songInfo.more) { return; }
        $http('/search', {
            keywords,
            type: 1,
            limit: 30,
            offset: songInfo.songs.length
        }).then((res) => {
            this.setState({
                loading: false,
                noData: false
            });
            if (!res.result || !res.result.songCount) {
                this.setState({
                    noData: true
                });
                return;
            }
            if (res.result && res.result.songs) {
                const tempSongList = res.result.songs.map((item) => {
                    item.al = item.album;
                    item.ar = item.artists;
                    return item;
                });
                this.setState({
                    songInfo: {
                        songs: songInfo.songs.concat(tempSongList),
                        more: songInfo.songs.concat(res.result.songs).length < res.result.songCount
                    }
                });
            }
        });
    }
    playSong () {

    }
    showMore () { }
    formatDuration (ms: number) {
        // @ts-ignore
        const minutes: string = formatNumber(parseInt(ms / 60000));
        // @ts-ignore
        const seconds: string = formatNumber(parseInt((ms / 1000) % 60));
        return `${minutes}:${seconds}`;
    }

    render () {
        const { activeTab } = this.props;
        console.log('Page -> render -> activeTab', activeTab);
        // eslint-disable-next-line no-shadow
        const { songInfo, noData, loading } = this.state;
        return (
            <View className='yl-single'>
                {
                    loading ? <CLoading /> :
                        <ScrollView scrollY onScrollToLower={this.getSongList.bind(this)} className='yl-single__scroll'>
                            {
                                noData ? <View className='yl-single__nodata'>暂无数据</View> : ''
                            }
                            {
                                songInfo.songs.map((item) => (
                                    <View key={item.id} className='yl-single__content__music'>
                                        <View className='yl-single__content__music__info' onClick={this.playSong.bind(this, item.id)}>
                                            <View className='yl-single__content__music__info__name'>
                                                {item.name}
                                            </View>
                                            <View className='yl-single__content__music__info__desc'>
                                                {`${item.ar[0] ? item.ar[0].name : ''} - ${item.al.name}`}
                                            </View>
                                        </View>
                                        <View className='fa fa-ellipsis-v yl-single__content__music__icon' onClick={this.showMore.bind(this)}></View>
                                    </View>
                                ))
                            }
                            {songInfo.more ? <CLoading /> : ''}
                        </ScrollView>
                }
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

interface Page {
    props: InitProps
    state: PageState
}

export default Page as ComponentClass<InitProps, PageState>;
