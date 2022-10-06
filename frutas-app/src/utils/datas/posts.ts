const posts: Array<any> = [
    {
        "id": 0,
        "isText": false,
        "isImage": false,
        "isVideo": true,
        "avatar": require('~/assets/images/ic1.png'),
        "image": require('~/assets/images/post1.png'),
        "likeCount": 66,
        "commentCount": 979,
        "shareCount": 332,
        "author": "Prince Dotson",
        "text": "",
        "videoUrl":"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "time": "02:42:03"
    },
    {
        "id": 1,
        "isText": false,
        "isImage": true,
        "isVideo": false,
        "avatar": require('~/assets/images/ic2.png'),
        "image": require('~/assets/images/post2.png'),
        "likeCount": 761,
        "commentCount": 84,
        "shareCount": 743,
        "author": "Hicks Melton",
        "videoUrl":"",
        "text": "Amet qui dolor cupidatat tempor et duis nostrud labore ad nisi ut laborum. Sit commodo dolor dolore ea velit eu sit. Qui qui aute officia exercitation voluptate velit pariatur dolor aute. Magna quis in excepteur dolor amet ipsum. Labore amet nulla ad voluptate tempor sunt dolor aliqua ipsum quis amet magna. Qui pariatur enim nostrud et et sunt laboris ea. Aliquip sunt proident nulla ad nulla occaecat.\r\nEsse nulla sunt eu nisi. Laboris mollit veniam ea aliquip est cillum ipsum laborum commodo tempor adipisicing occaecat. Esse eiusmod amet commodo exercitation veniam laborum duis aliquip dolor. Ad sunt consequat qui dolore ad in minim. Est officia consequat anim sunt pariatur adipisicing eu. Labore quis minim ut quis tempor consequat magna commodo est occaecat laboris do dolor. Aliqua aute consectetur amet officia officia officia fugiat amet ad pariatur in nulla magna sint.\r\n",
        "time": "12:46:45"
    },
    {
        "id": 3,
        "isText": false,
        "isImage": true,
        "isVideo": false,
        "avatar": require('~/assets/images/ic4.png'),
        "image": require('~/assets/images/post4.png'),
        "likeCount": 101,
        "commentCount": 263,
        "shareCount": 804,
        "author": "Wilda Bentley",
        "videoUrl":"",
        "text": "Eiusmod laboris qui quis id non consequat dolore ullamco velit voluptate commodo ex dolore. Excepteur aliquip amet eu consequat nulla et esse. Lorem tempor dolor quis mollit labore mollit ullamco. Ut laborum nisi dolore irure cillum exercitation nisi exercitation aliquip adipisicing ut. Aliquip sunt nulla exercitation labore pariatur fugiat nulla proident. Duis ad ullamco sint duis aliquip adipisicing eu cupidatat sint officia.\r\nExcepteur culpa qui voluptate do cillum. Velit ad laborum cupidatat sit quis aliquip ipsum proident tempor elit aliquip. Lorem incididunt do nulla et. Incididunt commodo exercitation amet adipisicing nulla et in sit do. Nisi deserunt Lorem aute mollit exercitation proident ea tempor culpa adipisicing reprehenderit laborum ea. Laborum deserunt consequat deserunt nisi anim aliqua cupidatat reprehenderit exercitation. Laboris laborum ipsum irure nulla consequat voluptate sunt sit officia amet nisi mollit non consequat.\r\n",
        "time": "09:44:33"
    },

    {
        "id": 5,
        "isText": false,
        "isImage": false,
        "isVideo": true,
        "avatar": require('~/assets/images/ic6.png'),
        "image": require('~/assets/images/post6.png'),
        "likeCount": 190,
        "commentCount": 670,
        "shareCount": 280,
        "author": "Madge Rose",
        "text":"",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "time": "02:09:50"
    },
    {
        "id": 6,
        "isText": false,
        "isImage": true,
        "isVideo": false,
        "avatar": require('~/assets/images/ic7.png'),
        "image": require('~/assets/images/post7.png'),
        "likeCount": 361,
        "commentCount": 939,
        "shareCount": 392,
        "author": "Suzette Richard",
        "videoUrl":"",
        "text": "In nostrud aliquip duis reprehenderit et qui est Lorem ut ad aliqua. Occaecat esse tempor reprehenderit voluptate occaecat aliqua ullamco amet sit non. Duis ipsum aliquip commodo et excepteur eiusmod cillum cupidatat enim excepteur consequat. Id nulla cupidatat ea non anim sunt officia amet ex esse ipsum et eiusmod. Aliqua culpa esse laborum nisi consectetur nulla in aliquip laborum. Est sunt minim nostrud cillum enim eiusmod aliqua incididunt deserunt sunt voluptate cillum dolor exercitation.\r\nEx consequat amet non eiusmod anim. Aute sunt ut eiusmod ullamco amet. Lorem elit tempor nostrud sit sit est culpa irure anim cillum ea dolore magna.\r\n",
        "time": "08:46:02"
    },
    {
        "id": 7,
        "isText": false,
        "isImage": false,
        "isVideo": true,
        "avatar": require('~/assets/images/ic8.png'),
        "image": require('~/assets/images/post8.png'),
        "likeCount": 611,
        "commentCount": 849,
        "shareCount": 613,
        "author": "Miranda Thornton",
        "text":"",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "time": "06:00:04"
    },
    {
        "id": 8,
        "isText": false,
        "isImage": true,
        "isVideo": false,
        "avatar": require('~/assets/images/ic10.png'),
        "image": require('~/assets/images/post9.png'),
        "likeCount": 267,
        "commentCount": 642,
        "shareCount": 760,
        "author": "Coleen Vazquez",
        "videoUrl":"",
        "text": "Veniam duis quis adipisicing Lorem labore mollit cupidatat fugiat culpa aliquip irure Lorem sint. Occaecat esse irure proident amet in exercitation. Dolore sunt nisi proident duis. Eiusmod Lorem elit velit mollit qui. Ullamco esse adipisicing anim nostrud proident ut esse ex ex qui. Nisi duis ut sunt mollit nulla exercitation id minim.\r\nNisi mollit ad duis id. Eiusmod voluptate anim exercitation duis incididunt sunt quis et nulla ipsum. Exercitation cupidatat Lorem nostrud ipsum amet sunt fugiat consectetur nulla veniam. Ipsum veniam occaecat anim quis dolor cillum anim eu non mollit.\r\n",
        "time": "03:17:12"
    },
    {
        "id": 9,
        "isText": false,
        "isImage": true,
        "isVideo": false,
        "avatar": require('~/assets/images/ic4.png'),
        "image": require('~/assets/images/post5.png'),
        "likeCount": 596,
        "commentCount": 46,
        "shareCount": 477,
        "author": "Ella Hood",
        "videoUrl":"",
        "text": "Minim magna commodo anim adipisicing aliqua eu ut qui sint. Enim dolore reprehenderit exercitation occaecat id esse adipisicing Lorem veniam. Anim sit velit ullamco laboris id id elit. Commodo mollit ad adipisicing deserunt nisi officia veniam occaecat adipisicing irure labore. Est dolore aute adipisicing ipsum esse deserunt. Dolore sint non mollit amet qui nulla nulla minim commodo sunt culpa ipsum occaecat.\r\nTempor commodo cillum esse magna est proident sint mollit pariatur aute sint. Sit sint ut deserunt non veniam labore anim irure in amet qui mollit incididunt officia. Ipsum proident anim consequat et cillum aute ea velit nisi cillum id et. Amet excepteur reprehenderit eu irure quis velit deserunt id consequat et sint mollit eiusmod mollit. Dolore velit proident sunt duis nostrud eu. Est aute eiusmod aliquip nisi id dolor ea occaecat consectetur voluptate magna. Et consequat ad incididunt cupidatat deserunt veniam esse elit et tempor qui tempor.\r\n",
        "time": "11:16:34"
    },
    {
        "id": 10,
        "isText": false,
        "isImage": true,
        "isVideo": false,
        "avatar": require('~/assets/images/ic4.png'),
        "image": require('~/assets/images/post5.png'),
        "likeCount": 427,
        "commentCount": 446,
        "shareCount": 637,
        "author": "Barnes Madden",
        "videoUrl":"",
        "text": "Veniam et tempor tempor anim. Dolor id consectetur sit minim cupidatat laborum laboris incididunt ut fugiat cupidatat aliquip. Sit exercitation id sint nisi aliqua adipisicing duis proident minim.\r\nLabore duis ipsum nulla culpa ipsum culpa ad dolore. Lorem anim velit velit consectetur dolore elit consectetur eiusmod id sint aute minim. Nulla laboris anim consectetur reprehenderit non occaecat. Lorem excepteur dolore amet reprehenderit enim mollit Lorem ipsum velit ut ea.\r\n",
        "time": "01:30:06"
    },
    {
        "id": 11,
        "isText": false,
        "isImage": true,
        "isVideo": false,
        "avatar": require('~/assets/images/ic6.png'),
        "image": require('~/assets/images/post8.png'),
        "likeCount": 186,
        "commentCount": 748,
        "shareCount": 970,
        "author": "Julie Ryan",
        "videoUrl":"",
        "text": "Nulla irure do exercitation veniam nisi pariatur laboris proident tempor mollit. Consectetur proident commodo excepteur mollit occaecat exercitation. Officia sit laborum velit eiusmod tempor ea.\r\nAmet sunt veniam eiusmod occaecat. Consequat adipisicing duis sit tempor adipisicing est minim sit pariatur nisi deserunt nisi labore. Sunt enim dolor cupidatat mollit adipisicing nulla fugiat non pariatur aliqua non Lorem. Aute eiusmod qui commodo nostrud veniam elit Lorem est sit adipisicing qui. Pariatur reprehenderit tempor cupidatat pariatur elit aliqua.\r\n",
        "time": "10:45:04"
    },
    {
        "id": 12,
        "isText": false,
        "isImage": true,
        "isVideo": false,
        "avatar": require('~/assets/images/ic5.png'),
        "image": require('~/assets/images/post1.png'),
        "likeCount": 624,
        "commentCount": 52,
        "shareCount": 437,
        "author": "Kasey Marsh",
        "videoUrl":"",
        "text": "Enim do consequat mollit consequat non magna sit laborum Lorem sint id consequat ullamco sunt. Voluptate sit Lorem dolore incididunt duis ipsum nulla. Consectetur quis commodo commodo officia deserunt ex laboris culpa laboris et labore nulla.\r\nVeniam deserunt nisi adipisicing eu cillum in cupidatat anim do non. Et nisi esse quis est deserunt dolor do. Est do nisi eiusmod occaecat ad commodo ex proident consequat amet. Proident voluptate qui ea dolor cupidatat. Lorem nisi ea tempor quis excepteur ut nulla duis duis enim veniam.\r\n",
        "time": "05:13:31"
    }
];
export default posts;
