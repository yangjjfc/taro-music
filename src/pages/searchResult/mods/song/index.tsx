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
        console.log('Page -> getSongList -> keyword111111111s', keywords);
        Taro.setNavigationBarTitle({
            title: `${keywords}的搜索结果`
        });
        this.setState({
            loading: true
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
                loading: false
            });
            console.log('Page -> getSongList -> res', res);
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


    formatDuration (ms: number) {
        // @ts-ignore
        const minutes: string = formatNumber(parseInt(ms / 60000));
        // @ts-ignore
        const seconds: string = formatNumber(parseInt((ms / 1000) % 60));
        return `${minutes}:${seconds}`;
    }

    render () {
        const { activeTab, onSwitchTab } = this.props;
        console.log('Page -> render -> activeTab', activeTab);
        // eslint-disable-next-line no-shadow
        const { totalInfo, loading, noData } = this.state;
        return (
            <AtTabsPane current={activeTab} index={1} className='yl-sone'>
                {
                    loading ? <CLoading /> :
                        <ScrollView scrollY className='yl-sone__scroll'>
                            {
                                noData ? <View className='yl-sone__nodata'>暂无数据</View> : ''
                            }
                        </ScrollView>
                }
            </AtTabsPane>
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
