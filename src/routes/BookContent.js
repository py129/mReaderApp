import React from 'react';
import { connect } from 'dva';
import { Link ,routerRedux } from 'dva/router';

import { NavBar, Tabs, Progress, Button,  Flex, Icon, InputItem, Popover, SegmentedControl, Drawer, List} from 'antd-mobile';
import styles from './BookContent.less';
import util from '../utils/util';
import { array } from 'prop-types';
import Item from 'antd-mobile/lib/popover/Item';

class BookContent extends React.Component {
    constructor(props){
        super(props);
		this.state = {
            bookType: 'female',
            type: 'hot',
            minor: '',
            isShowOther: false,
            open: false,
            currentNum: 0,
		};
    }
    componentDidMount = () => {
        var target = document.getElementById("bookContentBox");
        window.touch.on(target, 'swipeleft', function(ev){
            console.log("向左滑动.");
        });
        window.touch.on(target, 'swipeup', function(ev){
            console.log("向up滑动.");
        });
        window.touch.on(target, 'hold', function(ev){
            console.log("hold----");
        });
        window.touch.on(target, 'tap', (ev)=>{
            this.setState({
                isShowOther: !this.state.isShowOther
            })
        });
    }
    click = () => {
        this.props.dispatch({
            type: 'products/getBookType',
            payload: {}
        })
    }
    changeSearch=(data)=>{
        this.setState({
            ...data
        },()=>{
            this.props.dispatch({
                type: 'bookTypeInfo/getBookTypeInfo',
                payload: {
                    ...util.getQuery(),
                    type: this.state.type,
                    minor: this.state.minor
                }
            })
        })
    }
    onOpenChange = () => {
        this.setState({ open: !this.state.open });
    }
    clickChapter=(index)=>{
        console.log(index);
        this.setState({currentNum: index},()=>{
            this.getNewContent()
        })
    }
    getNewContent=()=>{
        this.props.dispatch({
            type: 'bookContent/bookContent',
            payload: {
                chapterLink: this.props.bookCapterList[this.state.currentNum].link,
            }
        }).then(()=>{
            this.setState({ open: false });
        })
    }
    componentWillReceiveProps=(nextprops)=>{
    }
    render=()=>{
        const { bookContent, bookCapterList } = this.props;
        const sidebar = (<div>
            <p className={styles.chapterTitle}>目录</p>
            {bookCapterList && bookCapterList.map((item, index) => {
              return (<p onClick={()=>{this.clickChapter(index)}} className={styles.chapterName} key={index} >{index + 1}-{item.title}</p>);
            })}
          </div>);
        const myImg = src => <img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" alt="" />;
        return (
            <div id="target">
                <Drawer
                    className={`bookDrawer ${styles.bookDrawer}`}
                    style={{ minHeight: document.documentElement.clientHeight}}
                    // enableDragHandle
                    contentStyle={{}}
                    sidebar={sidebar}
                    open={this.state.open}
                    onOpenChange={this.onOpenChange}
                >
                    {this.state.isShowOther
                        ?   <div className={styles.bookNavBar}>
                                <NavBar
                                mode="light"
                                icon={<Link to={{
                                    pathname:'/bookDetail',
                                    search: util.initQuery({book: util.getQuery().book})
                                }}>
                                    <Icon type="left" />
                                </Link>}
                                onLeftClick={() => console.log('onLeftClick')}
                                rightContent={[
                                    <Popover 
                                        overlayClassName="fortest"
                                        overlayStyle={{ color: 'currentColor' }}
                                        visible={this.state.visible}
                                        overlay={[
                                            (<Item key="4" value="scan" icon={myImg('tOtXhkIWzwotgGSeptou')} data-seed="logId">
                                                <Link to={{
                                                    pathname:'/',
                                                }}>
                                                    首页
                                                </Link>
                                            </Item>),
                                            (<Item key="5" value="special" icon={myImg('PKAgAqZWJVNwKsAJSmXd')} style={{ whiteSpace: 'nowrap' }}>排行</Item>),
                                        ]}
                                        align={{
                                            overflow: { adjustY: 0, adjustX: 0 },
                                            offset: [0, 0],
                                        }}
                                        onVisibleChange={this.changeSearch}
                                        onSelect={this.changeSearch}
                                    >
                                        <Icon key="1" type="ellipsis" />
                                    </Popover>
                                ]}
                                >{bookContent.chapter ? bookContent.chapter.title : ''}</NavBar>
                            </div>
                        : ""
                    }
                    <div id="bookContentBox" className={styles.bookContentBox}>
                        <h3 className={styles.bookChapterName}>{bookContent.chapter ? bookContent.chapter.title : ''}</h3>
                        <div>
                            {util.initContent(bookContent.chapter ? bookContent.chapter.cpContent : '').map((item,index)=>{
                                return <p className={styles.bookSection} key={index}>{ item ? item.replace(/\s/g,'') : ''}</p>
                            })}
                        </div>
                    </div>
                    {this.state.isShowOther
                        ?   <div className={styles.bookFooter}>
                                <div className={styles.bookProgress}>
                                    <span className={styles.bookFontSizeLeft}>Aa- </span>
                                    <Progress percent={40} position="normal" unfilled={true} appearTransition />
                                    <span className={styles.bookFontSizeRight}>Aa+ </span>
                                </div>
                                <div className={styles.bookReadType}>
                                    <SegmentedControl
                                        values={['默认', '夜间', '护眼']}
                                        tintColor={'#333'}
                                        style={{ height: '40px', width: '100%' }}
                                    />
                                </div>
                                <Flex className={styles.bookJump}>
                                    <Flex.Item className="center" ><span>上一章</span></Flex.Item>
                                    <Flex.Item className="center" ><span onClick={()=>{this.setState({open: true,isShowOther: false})}}>目录</span></Flex.Item>
                                    <Flex.Item className="center" ><span>下一章</span></Flex.Item>
                                </Flex>
                            </div>
                        : ''
                    }    
                </Drawer>
            </div>
        );
    }
};

export default connect(state => state.bookContent)(BookContent);