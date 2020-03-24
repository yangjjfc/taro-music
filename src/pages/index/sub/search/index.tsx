import { ComponentClass } from 'react'
import { AtSearchBar, AtIcon } from 'taro-ui'
import Taro, { Component, Config } from '@tarojs/taro'
import CLoading from '@/components/CLoading'
import classnames from 'classnames'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import $http from "@/utils/axios/index";
import { getStorageSync, setStorageSync,clearStorageSync } from '@/utils/custom/global';
import './index.scss'


type PageState = {
  searchValue: string,
  hotList: Array<{
    searchWord: string,
    score: number,
    iconUrl: string,
    content: string,
    iconType: number
  }>,
  historyList: Array<string>
}
type PageOwnProps = {}



interface Page {
  props: PageOwnProps;
  state: PageState;
}

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

  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
      hotList: [],
      historyList: []
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    this.getHotSearch()
  }

  componentWillUnmount() { }

  componentDidShow() {
    this.getHistoryList();
  }

  componentDidHide() { }

  //获取搜索历史
  getHistoryList() {
    let historyList = getStorageSync('historyList');
    if (historyList) {
      this.setState({
        historyList: historyList
      })
    }
  }

  searchTextChange(val) {
    this.setState({
      searchValue: val
    })
  }

  searchResult() {
    this.goResult(this.state.searchValue)
  }
  //跳转搜索结果
  goResult(keywords:string) {
    let historyList: string[] = this.state.historyList;
    if (historyList.length >= 5) {
      historyList.splice(0,1,keywords)
    } else {
      historyList.unshift(keywords);
    }
    historyList = [...new Set(historyList)];
    setStorageSync('historyList', historyList);

    // Taro.navigateTo({
    //   url: `/pages/searchResult/index?keywords=${keywords}`
    // })
  }

  //清空历史
  clearKeywordInHistory() {
    this.setState({
      historyList: []
    })
    clearStorageSync();
  }

  //搜索热榜
  getHotSearch() {
    $http('/search/hot/detail', {
    }).then((res) => {
      if (res.data) {
        this.setState({
          hotList: res.data
        })
      }
    })
  }


  render() {
    const { searchValue, hotList, historyList } = this.state
    return (
      <View className='yl-search'>
        <AtSearchBar
          showActionButton
          actionName='搜一下'
          value={searchValue}
          onChange={this.searchTextChange.bind(this)}
          onActionClick={this.searchResult.bind(this)}
          onConfirm={this.searchResult.bind(this)}
          focus={true}
          className='yl-search__input'
        />
        <ScrollView className='yl-search__content' scrollY>
          {
            historyList.length ? <View className='yl-search__history'>
              <View className='yl-search__history__title'>
                <Text className='yl-search__history__title__label'>
                  搜索历史
                </Text>
                <AtIcon prefixClass='icon'   value='shanchu' size='20' color='#cccccc' className='yl-search__history__title__icon' onClick={this.clearKeywordInHistory.bind(this)}></AtIcon>
              </View>
              <ScrollView className='yl-search__history__list' scrollX>
                {
                  historyList.map((keyword) => <Text className='yl-search__history__list__item' key={keyword} onClick={this.goResult.bind(this, keyword)}>{keyword}</Text>)
                }
              </ScrollView>
            </View> : ''
          }
          <View className='yl-search__hot'>
            <View className='yl-search__hot__title'>
              <Text className='yl-search__hot__title__label'>
                热搜榜
              </Text>
            </View>
            {
              hotList.length === 0 ? <CLoading /> : ''
            }
            <View className='yl-search__hot__list'>
              {
                hotList.map((item, index) => <View className='yl-search__hot__list__item' key={item.searchWord} onClick={this.goResult.bind(this, item.searchWord)}>
                  <View className={
                    classnames({
                      'yl-search__hot__list__item__index': true,
                      spec: index <= 2
                    })
                  }>
                    {index + 1}
                  </View>
                  <View className='yl-search__hot__list__item__info'>
                    <View className="">
                      <Text className={
                        classnames({
                         'yl-search__hot__list__item__info__title': true,
                          spec: index <= 2
                        })
                      }>
                        {item.searchWord}
                      </Text>
                      <Text className='yl-search__hot__list__item__info__score'>
                        {item.score}
                      </Text>
                      {
                        item.iconUrl ? <Image src={item.iconUrl} mode="widthFix" className={
                          classnames({
                            'yl-search__hot__list__item__info__icon': true,
                            spec: item.iconType === 5
                          })
                        } /> : ''
                      }
                    </View>
                    <View className='yl-search__hot__list__item__info__desc'>
                      {item.content}
                    </View>
                  </View>
                </View>)
              }
            </View>
          </View>
        </ScrollView>
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

export default Page as ComponentClass<PageOwnProps, PageState>
