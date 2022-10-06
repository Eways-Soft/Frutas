import React from 'react'
import {Text} from 'react-native'
import Constant from '../Constants'
import {RequestService} from './RequestService'

const BASE_URL = Constant.BASE_URL

// PreLogin Actions Start

export const UserLogin = async (data, navigation) => {
	const url = `${BASE_URL}login`
	console.log('UserLogin :',url)
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_POST();
	//console.log('response :',response)
	return response;
};

export const UserRegister = async (data, navigation) => {
	const url = `${BASE_URL}userregister`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
};

export const ForgetPassword = async (data, navigation) => {
	const email = data.email
	const url = `${BASE_URL}forgetpass?email=${email}`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

export const GetCityData = async (data, navigation) => {
	const email = data.email
	const url = `${BASE_URL}getcities`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
};
// PreLogin Actions End


// PostLogin Actions Start

export const getAllBasketsForHome = async (data, navigation) => {
	const userid = data.userid
	const catid = data.catid
	const currentpage = data.currentpage
	const url = `${BASE_URL}getallbasketshome`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

export const getUserGridImages = async (data, navigation) => {
	const userid = data.userid
	const catid = data.catid
	const currentpage = data.currentpage
	const url = `${BASE_URL}getgridimages/${userid}?page=${currentpage}`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

export const getUserPostsSelectedImageUp = async (data, navigation) => {
	const userid = data.userid
	const postid = data.postid
	const currentpage = data.currentpage
	const url = `${BASE_URL}getpostsclickgridimageup/${userid}/${postid}?page=${currentpage}`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

export const getUserPostsSelectedImageDown = async (data, navigation) => {
	const userid = data.userid
	const postid = data.postid
	const currentpage = data.currentpage
	const url = `${BASE_URL}getpostsclickgridimagedown/${userid}/${postid}?page=${currentpage}`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

export const getUserPosts = async (data, navigation) => {
	const userid = data.userid
	const catid = data.catid
	const currentpage = data.currentpage
	const url = `${BASE_URL}getUserPosts/${userid}/${catid}?page=${currentpage}`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

export const getUserFriendPosts = async (data, navigation) => {
	const userid = data.userid
	const friendid = data.friendid
	const currentpage = data.currentpage
	const url = `${BASE_URL}profile/${userid}/${friendid}?page=${currentpage}`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

export const getUserBookmarkPosts = async (data, navigation) => {
	const url = data.url
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

export const getAllComments = async (data, navigation) => {
	const userid = data.userid
	const postid = data.postid
	const currentpage = data.currentpage
	const url = `${BASE_URL}AppAllComments/${userid}/${postid}?page=${currentpage}`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

export const CommentSave = async (data, navigation) => {
	const url = `${BASE_URL}AppComment`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
};

export const removeComment = async (data, navigation) => {
	const url = `${BASE_URL}appCommentDelete`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
};

export const AddBookmark = async (data, navigation) => {
	const url = `${BASE_URL}AppBookmark/post`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
};

export const RemoveBookmark = async (data, navigation) => {
	const url = `${BASE_URL}AppBookmark/remove`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
};

export const DeletePost = async (data, navigation) => {
	const url = `${BASE_URL}deletepost`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
};

export const PostImagesUpload = async (data, navigation,files) => {
	const url = `${BASE_URL}deletepost`
	const params = {url: url, body: data, files:files};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
};

export const getUserProfile = async (data, navigation) => {
	const url = `${BASE_URL}appprofile`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
};

export const updateUserProfile = async (data, navigation, Philosophys) => {
	const url = `${BASE_URL}appProfileUpdate`
	const params = {url: url, body: data, Philosophys: Philosophys};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
};

export const SharePost = async (data, navigation) => {
	const url = `${BASE_URL}appPostData`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
};

export const getUserFriends = async (data, navigation) => {
	const userid = data.userid
	const currentpage = data.currentpage
	const url = `${BASE_URL}appfriends/${userid}?page=${currentpage}`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

export const getInviteDetail = async (data, navigation) => {
	const userid = data.userid
	const url = `${BASE_URL}AppInvite/${userid}`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

export const sendInvitation = async (data, navigation) => {
	const url = `${BASE_URL}appinvitefriends`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
};

export const removeFriend = async (data, navigation) =>{
	const url = `${BASE_URL}appRemoveFriend`
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_POST();
	return response;
}

export const getSearchData = async (data, navigation) => {
	const searchText = data.searchText
	const tab = data.tab;
	const currentpage = data.currentpage
	const url = `${BASE_URL}appsearch/${tab}/?search=${searchText}&page=${currentpage}`
	//console.log(url)
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

export const getSearchPagenationData = async (data, navigation) => {
	const searchText = data.searchText
	const tab = data.tab;
	const currentpage = data.currentpage
	const url = `${BASE_URL}appsearchpagination/${tab}/?search=${searchText}&page=${currentpage}`
	//console.log(url)
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};

// PostLogin Actions End


//Test
export const getUserList = async (data, navigation) => {
	const url = data.url
	const params = {url: url, body: data};
	const response = await new RequestService(params, navigation).call_GET();
	return response;
};