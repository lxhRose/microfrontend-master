import * as React from 'react';
import { Breadcrumb as AntdBreadcrumb, Card } from 'antd';
import { Link } from 'dva/router';

interface OtherData {
    statusName?: any,
    status?: string,
    name?: string,
}

interface Data {
    name?: string,
    path?: string;
    onMyClick?: any
}

interface Props {
    data: Array<Data>;
    otherData?: OtherData;
}
export default class Breadcrumb extends React.PureComponent<Props, any> {
    render() {
        const { otherData } = this.props;
        return (
            <Card bodyStyle={{padding: 15}}>
                <AntdBreadcrumb>
                    {
                        (this.props.data || []).map( (item, index) => (
                            item.onMyClick ? <AntdBreadcrumb.Item>
                                <a onClick={item.onMyClick}>{item.name}</a>
                            </AntdBreadcrumb.Item>
                            : <AntdBreadcrumb.Item key={index}>
                              {item.path ? <Link to={item.path}>{item.name}</Link> : item.name}
                            </AntdBreadcrumb.Item>
                        ))
                    }
               </AntdBreadcrumb>
               {otherData && 
                    <div style={{paddingTop: otherData.name && otherData.status ? "10px" : "0", position: "relative"}}>
                        {otherData.name &&
                             <strong style={{fontSize:"16px"}}>{otherData.name}</strong>}
                        {otherData.statusName &&
                            <span style={{position: "absolute", top: "-20px", right: "0"}}>
                            {otherData.statusName}
                        </span>}
                        {otherData.status &&
                             <strong style={{float: "right"}}>{otherData.status}</strong>}
                    </div>
                }
            </Card>
        )
    }
}
