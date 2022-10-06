import React from 'react'
import { Text } from 'react-native'
import NetInfo from "@react-native-community/netinfo";

const DEFAULT_HEADERS = {
  // DeviceToken: '1234567890',
  // 'Content-Type': 'multipart/form-data',
  'Accept': 'application/json',
};

const GET = 'GET';
const HEAD = 'HEAD';

export class RequestService {
	constructor(params,navigation){
		if(!params.url){
			throw new Error('Invalid request URl !..')
		}
		this.params = params
		this.navigation = navigation
	}

	call_GET = () => {
		this.params.method = 'GET'
		return this.call();
	}

	call_POST = () => {
		this.params.method = 'POST'
		return this.call();
		//const response = {'user':'vxvsdfsdfsdfsdfsdfdsfd','id':'123'};
		//return response
	}

	call = async () => {
	    //console.log('RequestService navigation : ', `${this.navigation}`);
	    if (!this.params.method) {
	      return {};
	    }
	    const netStatus = await (await NetInfo.fetch()).isConnected;
	    //console.log('RequestService netStatus : ', `${netStatus}`);

	    if (netStatus) {
		    try {
		       /* console.log(
		          'RequestService mount Request : ',
		          `${JSON.stringify(this.mountRequest(this.params))}`,
		        )*/
		        // eslint-disable-next-line no-undef
		        const asyncResponse = await fetch(
		          this.params.url,
		          this.mountRequest(this.params),
		          2000,
		        )

		        //console.log('RequestService REQUEST :', await asyncResponse);
		        const json = await asyncResponse.json();

		        //console.log('RequestService RESPONSE JSON :', json);
		        return json;

		    } catch (e) {
		        console.log('RequestService call catch ', ` ${e}`);
		    }
	    } else {
	    	alert('Internet Connection is Weak');
	    }
  	}

  	mountRequest = () => {
  		//console.log('RequestService mountRequest hare : ');
		const request = {
			method: this.params.method,
			headers: this.mountHeaders(),
		}

		if (request.method !== GET && request.method !== HEAD) {
			request.body = this.mountBody();
		}
		
		return request;
	}

	mountHeaders = () => {
		let mountedHeaders = Object.assign(DEFAULT_HEADERS);

		if (this.params.headers) {
			mountedHeaders = Object.assign(mountedHeaders, this.params.headers);
		}

		return mountedHeaders;
	}

	mountBody = () => {
		if (!this.params.body) {
			return {};
		}

		const form_data = new FormData();
		const {body} = this.params;

		for (const key in body) {
			form_data.append(key, body[key]);
		}

		for (const file in this.params.files) {
			const uriPart = this.params.files[file].split('.')
			const fileExtension = uriPart[uriPart.length - 1]

			if (this.params.body.file_type === constant.POST_FILE_TYPE_VIDEO) {
				const video = {
					uri: this.params.files[file],
					type: `video/${fileExtension}`,
					name: `${file}.${fileExtension}`,
				}

				form_data.append(file, video)

			} else {
				const photo = {
					uri: this.params.files[file],
					type: `image/${fileExtension}`,
					name: `${file}.${fileExtension}`,
				}
				
				form_data.append(file, photo);
			}
		}
		return form_data
	}
}