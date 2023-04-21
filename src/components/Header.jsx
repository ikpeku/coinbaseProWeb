import { HomeFilled, MoneyCollectFilled, MenuOutlined } from '@ant-design/icons';
import { Tabs, } from 'antd';



export const HeaderComponent = ({ onChange, setOpen }) => {



  return (
    <>
      <Tabs
        className='mr-5'
        defaultActiveKey="1"
        onChange={onChange}
        items={[{ icon: HomeFilled, name: "Home" }, { icon: MoneyCollectFilled, name: "Favourite Coin" }].map((Icon, i) => {
          const id = String(i + 1);
          return {
            label: (
              <span className='flex items-center'>
                <Icon.icon />
                {Icon.name}
              </span>
            ),
            key: id,
            // children: `Tab ${id}`,
          };
        })}
      />
      <MenuOutlined className='ml-auto border sm:hidden' onClick={() => setOpen(true)} />

    </>
  )
}
