import React, {Component, Fragment} from 'react';
import Link from 'next/link'
import axios from 'axios';
import { Pagination } from 'antd';
import Router, {withRouter} from 'next/router'
import { LifeListRequest } from '../../config/request'

@withRouter

class Life extends Component{
	
	constructor(props){
		super(props)
		this.state = {
			totalPage: 0,
			pageSize: 3,
			currentPage: 1,
			currentList: []
		}
	}

	paginationChange(page){
		Router.push(`/blog/${page}`);
	}

	paginationRender(page, type, originalElement){

		if (type === 'prev') {
			return <a title="上一页">上一页</a>;
		} else if (type === 'next') {
			return <a title="下一页">下一页</a>;
		}
			
		return (
			<Link as={`/blog/${page}`} href={`/blog?page=${page}`}>
				<span>{page}</span>
			</Link>
		)
	}

	render(){
		const { currentPage, router, isEmpty } =  this.props;
		if(isEmpty){
            return false;
        }
		const { list, total } = this.props.articleData;
		const articleList = list;
		const totalPage = total;
		const { pageSize} = this.state;
		return(
			<Fragment>
				<div className='life-main clearfix'>
					{
						articleList.map(item=>(
							<div className='life-item'>
							<Link as={`/p/${item._id}`} href={`/detail?id=${item._id}`}>
								<a title={item.title}>
									<h1 className='item-title'>{item.title}</h1>
									{
										item.preview ? <img src={item.preview} className="article-preview" alt={item.title}/> : ''
									}
									<p className='item-desc'>{item.description}</p>
								</a>
								</Link>
							</div>
							
						))
					}
					<div className='pagination-wrap'>
						<Pagination 
							total={totalPage} 
							current={currentPage || 1}
							defaultPageSize={pageSize}
							onChange={this.paginationChange.bind(this)}
							itemRender={this.paginationRender.bind(this)}
						/>
					</div>
					<style global jsx>{`
					.pagination-wrap{
						padding-top: 75px;
					}
					`}</style>
				</div>
				
			</Fragment>
		)
	}

}


Life.getInitialProps = async function(context) {
	const {page} = context.query;
	const initPagination = {
		pageSize: 3,
		currentPage: page || 1,
		cat: 'life'
	}
	const articleList = await axios.post(LifeListRequest, initPagination);
	
	if(articleList.data.list.length){
        return {
			articleData: articleList.data,
			currentPage: Number(page)
		}
    }else{
        return {
            isEmpty: true
        }
    }
}


export default Life