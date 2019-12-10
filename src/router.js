import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Signup from './views/Signup.vue'
import UsersFeed from './views/UsersFeed.vue'
import UserProfile from './views/UserProfile.vue'
import ParkDetails from './views/ParkDetails.vue'
import parksList from './components/ParksList.cmp.vue'
import EditUser from './views/EditUser.vue'
import parksFeed from './views/parksFeed.cmp.vue'


Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', component: Home },
        { path: '/signup', component: Signup },
        { path: '/user', component: UsersFeed },
        { path: '/user/:id', component: UserProfile },
        { path: '/user/edit/:id', component: EditUser },
        { path: '/user/edit', component: EditUser },
        { path: '/park-details', component: ParkDetails },
        { path: '/park', component: parksList },
        { path: '/parks', component: parksFeed },
    ]
})