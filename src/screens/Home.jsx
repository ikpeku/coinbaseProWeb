import { useState } from 'react';
import { UserOutlined, HomeOutlined, MenuOutlined } from '@ant-design/icons';
import { Layout, Menu, Col, Row, Drawer } from 'antd';
import { HeaderComponent } from '../components/Header';
import { CoinBoard } from '../components/CoinBoard';
import { Favcoin } from '../components/Favcoin';
import { FirstBoard } from '../components/FirstBoard';
import { CoinMarket } from '../components/CoinMarket';
// import { useNavigate } from 'react-router-dom';
import { SignnedOut } from '../config/firebaseConfig';
import { Profile } from '../components/Profile';
import TransactionScreen from './TransactionScreen';


export const Home = () => {

    // Drawer controller

    const [open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(false);
    };
    // drawer end
    const { Sider, Header, Footer, Content } = Layout
    const [collapsed, setCollapsed] = useState(false);
    const [triggerFav, setTriggerFav] = useState(false)
    const [trigger, setTrigger] = useState(null)


    const [user, setUser] = useState(false)
    const [transaction, setTransaction] = useState(false)


    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }
    const items = [
        getItem('Home', '1', <HomeOutlined />),
        getItem('User', '2', <UserOutlined />),
        getItem('Contact Us', '3', <UserOutlined />, [
            getItem('contact@coinbasepro.tradegurultd.com', '4', <UserOutlined />)
        ]),
    ];

    const onChange = (event) => {
        setTransaction(false)
        setUser(false)
        setOpen(false);

        if (event === "1") {
            setTriggerFav(false)


        } else {
            setTriggerFav(true)

        }
    }

    const MenuPressed = (e) => {
        setOpen(false);

        if (e.key === "2") {

            setUser(true)
            setTransaction(false)
        } else {
            setUser(false)
            setTransaction(false)
        }
    }




    return (
        <Layout className="flex-1 w-full max-h-screen min-h-screen ">
            <Sider trigger={null}
                width={200}
                // breakpoint='sm'
                collapsible collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className='hidden md:flex flex-col'>
                <div
                    style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <h2 className='text-center text-white font-bold py-1'>COINBASEPRO</h2>
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={MenuPressed} />



                <div
                    onClick={() => SignnedOut()}
                    className='absolute w-4/5 bottom-10  mx-auto cursor-pointer'
                    style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <h2 className='text-center text-white font-bold py-1'>Log-out</h2>
                </div>

            </Sider>

            <Drawer
                // title="Basic Drawer"
                placement={"left"}
                closable={false}
                onClose={onClose}
                open={open}
                key={"left"}
                width={"80%"}
                style={{ margin: 0, backgroundColor: "#001529" }}



            >

                <div
                    style={{
                        height: 32,
                        // margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <h2 className='text-center text-white font-bold py-1'>COINBASEPRO</h2>
                </div>

                <Menu className='mt-8 h-full aspect-auto' theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={MenuPressed} />


                <div
                    onClick={() => SignnedOut()}
                    className='absolute w-4/5 bottom-10  mx-auto cursor-pointer'
                    style={{
                        // height: 32,
                        // margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <h2 className='text-center text-white font-bold py-1'>Log-out</h2>
                </div>

            </Drawer>

            <Layout >

                <Header style={{ backgroundColor: "rgba(0,0,0, 0.1)" }} className="flex flex-1 w-full items-center border">
                    <HeaderComponent setOpen={setOpen} onChange={onChange} />

                </Header>

                <Content>
                    {/* <Row className=' h-full'> */}


                    <Row className='grid sm:grid-cols-2  h-full' >

                        {/* Home */}
                        {!triggerFav && !user && !transaction && <Col className='transition ease-in-out duration-700 h-full grid grid-rows-2  border-["rgba(255, 255, 255, 0.2)"] border-r-2 p-3'>

                            <FirstBoard transaction={setTransaction} />

                            <Favcoin />
                        </Col>}

                        {/* Favourite market */}
                        {triggerFav && !user && !transaction && <Col className=' h-full  border-["rgba(255, 255, 255, 0.2)"] border-r-2 p-3'>

                            <CoinBoard trigger={setTriggerFav} />
                        </Col>}

                        {user && <Col className=' h-full  border-["rgba(255, 255, 255, 0.2)"] border-r-2 p-3'>

                            <Profile />

                            {/* <CoinBoard /> */}
                        </Col>}



                        {/* transaction */}
                        {transaction && <Col className=' h-full  border-["rgba(255, 255, 255, 0.2)"] border-r-2 p-3'>
                            <TransactionScreen />

                        </Col>}


                        {/* market trend display */}
                        <Col className='p-3 hidden sm:block'>
                            <CoinMarket />
                        </Col>

                    </Row>
                </Content>

                <Footer className='hidden sm:block'>
                    coinbasepose copyright ©2023
                </Footer>
            </Layout>

        </Layout>
    )
}
