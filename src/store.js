import Vue from 'vue'
import Vuex from 'vuex'
import dogsService from "./services/dogs.service.js"
import googleMapsService from "../src/services/googleMaps.service.js";




Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        filterBy: null,
        dogs: [],
        sortByDistanceDogs: null,
        userLoc: null,
        currPark: null,
        parks: null,
        compInProfile: "Gallery",
        isChatOpen: false,
        currUserChatWith: null,
        dog: null,
        currUser: null,
    },
    mutations: {
        setIsOpenChat(state, { dog }) {
            state.isChatOpen = !state.isChatOpen
            state.currUserChatWith = dog
        },
        openChat(state) {
            state.isChatOpen = true;
        },
        updateCompInProfile(state, {
            comp
        }) {
            state.compInProfile = comp
        },
        setFilter(state, filter) {
            state.filterBy = JSON.parse(JSON.stringify(filter));
        },
        setLoc(state, {
            pos
        }) {
            state.userLoc = {
                position: {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }
            };
        },
        setFilterBy(state, { filterBy }) {
            state.filterBy = filterBy
        },

        setSortDogs(state, {
            res
        }) {
            for (var i = 0; i < state.dogs.length; i++) {
                state.dogs[i].distanceTextFromUser = res.elements[i].distance.text;
                state.dogs[i].distanceValueFromUser = res.elements[i].distance.value;
            }
            if (!state.currPark) {
                state.dogs.sort(function(a, b) {
                    return a.distanceValueFromUser - b.distanceValueFromUser;
                });
            }
        },
        setSortParksNearUser(state, {
            res
        }) {
            for (var i = 0; i < state.parks.length; i++) {
                state.parks[i].distanceTextFromUser = res.elements[i].distance.text;
                state.parks[i].distanceValueFromUser = res.elements[i].distance.value;
            }
        },
        setSortDogsByMap(state, {
            res
        }) {
            for (var i = 0; i < state.dogs.length; i++) {
                state.dogs[i].distanceTextFromMap = res.elements[i].distance.text;
                state.dogs[i].distanceValueFromMap = res.elements[i].distance.value;
            }
            state.dogs.sort(function(a, b) {
                return a.distanceValueFromUser - b.distanceValueFromUser;
            });
        },
        setDogs(state, {
            dogs
        }) {
            state.dogs = dogs
        },
        deleteDog(state, {
            dogId
        }) {
            const idx = state.dogs.findIndex(dog => dog._id === dogId);
            state.dogs.splice(idx, 1);
        },
        addDog(state, {
            dog
        }) {
            state.dogs.unshift(dog)
        },
        setCurrPark(state, { park }) {
            state.currPark = park;
        },
        setParks(state, {
            gardens
        }) {
            state.parks = gardens;
        },
        removeDogFriendShip(state, { updatedDog }) {
            const dogIdx = state.dogs.findIndex(dog => dog._id === updatedDog)
            var dog;
            state.dogs.forEach(currDog => {
                if (currDog._id === updatedDog) dog = currDog
            })

            dog.friends.forEach((dogFriend, idx) => {
                if (dogFriend.userId === state.currUser._id)
                    dog.friends.splice(idx, 1);
            })
            state.currUser.friends.forEach((dogFriend, idx) => {
                if (dogFriend.userId === dog._id)
                    state.currUser.friends.splice(idx, 1);
            })

            const userIdx = state.dogs.findIndex(dog => dog._id === state.currUser._id)
            state.dogs.splice(userIdx, 1, state.currUser);
            state.dogs.splice(dogIdx, 1, dog)
            state.dog = state.currUser;
        },

        rejectDogFriendShip(state, {
            updatedDog
        }) {
            const dogIdx = state.dogs.findIndex(dog => dog._id === updatedDog.userId)
            var dog;
            state.dogs.forEach(currDog => {
                if (currDog._id === updatedDog.userId) dog = currDog
            })

            dog.sentFriendsReq.forEach((id, idx) => {
                if (id === state.currUser._id)
                    dog.sentFriendsReq.splice(idx, 1);
            })
            state.currUser.gotFriendsReq.forEach((object1, idx) => {
                if (object1.userId === dog._id)
                    state.currUser.gotFriendsReq.splice(idx, 1);
            })

            const userIdx = state.dogs.findIndex(dog => dog._id === state.currUser._id)
            state.dogs.splice(userIdx, 1, state.currUser);
            state.dogs.splice(dogIdx, 1, dog)
            state.dog = state.currUser;

        },

        updateDogFriendShip(state, {
            updatedDog
        }) {
            console.log(state.dogs)
            const dogIdx = state.dogs.findIndex(dog => dog._id === updatedDog.userId)
            var dog;
            state.dogs.forEach(currDog => {
                if (currDog._id === updatedDog.userId) dog = currDog
            })
            dog.friends.push({
                userId: state.currUser._id,
                userImg: state.currUser.profileImg,
                userName: state.currUser.owner.fullName
            });
            state.currUser.friends.push(updatedDog)
            dog.sentFriendsReq.forEach((id, idx) => {
                if (id === state.currUser._id)
                    dog.sentFriendsReq.splice(idx, 1);
            })
            state.currUser.gotFriendsReq.forEach((object1, idx) => {
                if (object1.userId === dog._id)
                    state.currUser.gotFriendsReq.splice(idx, 1);
            })

            const userIdx = state.dogs.findIndex(dog => dog._id === state.currUser._id)
            state.dogs.splice(userIdx, 1, state.currUser);
            state.dogs.splice(dogIdx, 1, dog)
            state.dog = state.currUser;
        },


        updateDogFriendReq(state, { updatedDogId }) {
            const dogIdx = state.dogs.findIndex(dog => dog._id === updatedDogId)
            var dog;
            state.dogs.forEach(currDog => {
                if (currDog._id === updatedDogId) dog = currDog
            })

            dog.gotFriendsReq.push({
                userId: state.currUser._id,
                userImg: state.currUser.profileImg,
                userName: state.currUser.owner.fullName
            })
            const userIdx = state.dogs.findIndex(dog => dog._id === state.currUser._id)
            state.currUser.sentFriendsReq.push(updatedDogId)

            state.dogs.splice(userIdx, 1, state.currUser);
            state.dogs.splice(dogIdx, 1, dog)
        },

        updateDogLikes(state, {
            updatedDogId
        }) {
            const dogIdx = state.dogs.findIndex(dog => dog._id === updatedDogId)
            var dog;
            state.dogs.forEach(currDog => {
                if (currDog._id === updatedDogId) dog = currDog
            })
            dog.gotLikes.push({
                userId: state.currUser._id,
                userImg: state.currUser.profileImg,
                userName: state.currUser.owner.fullName
            })
            const userIdx = state.dogs.findIndex(dog => dog._id === state.currUser._id)
            state.currUser.sentLikes.push(updatedDogId)

            state.dogs.splice(userIdx, 1, state.currUser);
            state.dogs.splice(dogIdx, 1, dog)
        },

        updateDog(state, {
            dog
        }) {
            const idx = state.dogs.findIndex(currDog => currDog._id === dog._id)
            state.dogs.splice(idx, 1, dog);

        },

        setDog(state, {
            dog
        }) {
            state.dog = dog;
        },

        setLoginUser(state, {
            currUserLoggedIn
        }) {
            state.currUser = currUserLoggedIn;
        },
        setLoggedUser(state, {
            userLoggedNow
        }) {
            state.currUser = userLoggedNow;
        },
        setLoggedOutUser(state) {
            state.currUser = null;
        },



    },
    getters: {
        compToShoe(state) {
            return state.compInProfile;
        },
        userYouChatWith(state) {
            return state.currUserChatWith;
        },
        dogsToShow(state) {
            if (state.currUser === null) {
                var newDogs = [state.dogs[0], state.dogs[1], state.dogs[2], state.dogs[3]];
                return newDogs;
              } else {
                const dogsToShow = state.dogs.filter(
                  dog => dog._id !== state.currUser._id
                );
                var newDogs = [
                  dogsToShow[0],
                  dogsToShow[1],
                  dogsToShow[2],
                  dogsToShow[3]
                ];
                return newDogs;
              }
        },
        getCurrPark(state) {
            return state.currPark;
        },

        getParks(state) {
            return state.parks;
        },
        isChatOpen(state) {
            return state.isChatOpen;
        },
        getUserLoc(state) {
            return state.userLoc
        },
        getNotfications(state) {
            return state.currUser.gotFriendsReq;
        },
        gotLikes(state) {
            return state.currUser.gotLikes;
        },
        getLoggedinUser(state) {
            return state.currUser;
        },
        getcurrLoggedinUser(state) {
            return state.currUser;
        },
        getDog(state) {
            return state.dog;
        },
        getDogs(stste){
            return stste.dogs
        }
    },

    actions: {
        isChatOpen(context, { dog }) {
            context.commit({
                type: 'setIsOpenChat',
                dog
            })
        },

        openChat(context) {
            context.commit({
                type: 'openChat',
            })
        },

        loadSortDogs(context) {
            var x = [];
            for (var i = 0; i < context.state.dogs.length; i++) {
                x.push(context.state.dogs[i].location.lat + "," + context.state.dogs[i].location.lng);
            }
            x = x.join("|");
            googleMapsService
                .getDist({
                    userLoc: context.state.userLoc.position.lat + "," + context.state.userLoc.position.lng,
                    usersLoc: x
                })
                .then(res => {
                    context.commit({
                        type: 'setSortDogs',
                        res
                    })
                    return res
                });
            if (context.state.currPark) {
                googleMapsService
                    .getDist({
                        userLoc: context.state.currPark.geometry.location.lat + "," + context.state.currPark.geometry.location.lng,
                        usersLoc: x
                    })
                    .then(res => {
                        context.commit({
                            type: 'setSortDogsByMap',
                            res
                        })
                        return res
                    });
            }
        },
        loadCompInProfile(context, { comp }) {
            context.commit({
                type: 'updateCompInProfile',
                comp
            })
            return comp
        },
        loadParks(context, { gardens }) {
            context.commit({
                type: 'setParks',
                gardens
            })
        },
        async loadParksLocFromUser(context) {
            var x = [];
            for (var i = 0; i < context.state.parks.length; i++) {
                x.push(context.state.parks[i].geometry.location.lat + "," + context.state.parks[i].geometry.location.lng);
            }
            x = x.join("|");
            try {
                const res = await googleMapsService
                    .getDist({
                        userLoc: context.state.userLoc.position.lat + "," + context.state.userLoc.position.lng,
                        usersLoc: x
                    })
                context.commit({
                    type: 'setSortParksNearUser',
                    res
                })
                return res
            } catch (err) {
                console.log(err)
            }
        },
        async loadDogs(context) {
            var dogs;
            try {
                if (context.state.filterBy === null) {
                    var str = ""
                    dogs = await dogsService.query(str)
                } else {
                    dogs = await dogsService.query(context.state.filterBy)
                }
                context.commit({
                    type: 'setDogs',
                    dogs
                })
                context.commit({
                    type: 'setFilterBy',
                    filterBy: ''
                })

                return dogs
            } catch (err) {
                console.log(err);
            }
        },

        async loadUserLoc(context) {
            try {
                const pos = await dogsService.getPosition()
                context.commit({
                    type: 'setLoc',
                    pos
                })
                return pos
            } catch (err) {
                console.log(err);
            }
        },

        async loadDogById(context, { dogId }) {
            try {
                const dog = await dogsService.getById(dogId)
                context.commit({
                    type: 'setDog',
                    dog
                })
                return dog
            } catch (err) {
                console.log(err);
            }
        },
        async deleteDog(context, payload) {
            try {
                await dogsService.remove(payload.dogId)
                context.commit({
                    type: 'deleteDog',
                    dogId: payload.dogId
                })
            } catch (err) {
                console.log(err);
            }

        },

        async addDog(context, { dog }) {
            try {
                const addedDog = await dogsService.add(dog)
                context.commit({
                    type: 'addDog',
                    dog: addedDog
                })
                return addedDog
            } catch (err) {
                console.log(err);
            }

        },

        async updateDog(context, { dog }) {
            try {
                const updatedDog = await dogsService.update(dog)
                context.commit({
                    type: 'updateDog',
                    dog: updatedDog
                })
                return updatedDog
            } catch (err) {
                console.log(err);
            }

        },

        goToPark(context, { park }) {
            context.commit({
                type: 'setCurrPark',
                park
            })
        },
        setFilter(context, { filterBy }) {
            context.commit({
                type: 'setFilterBy',
                filterBy
            })
        },
        async userLogout(context) {
            try {
                await dogsService.logOut()
                context.commit({
                    type: 'setLoggedOutUser'
                })
            } catch (err) {
                console.log(err);
            }
        },

        async userSignup(context,  {user} ) {
            try {
                const userSignedUp = await dogsService.signUp(user)
                console.log('This is Great signup!', userSignedUp)
            } catch (err) {
                console.log(err);
            }

        },

        async userLogin(context, { currUser }) {
            try {
                const currUserLoggedIn = await dogsService.logIn(currUser)
                context.commit({
                    type: 'setLoginUser',
                    currUserLoggedIn: currUserLoggedIn
                })
            } catch (err) {
                console.log(err);
            }

        },

        async removeFriend(context, { dogId }) {
            try {
                const updatedDog = await dogsService.removeFriendship(dogId)
                context.commit({
                    type: 'removeDogFriendShip',
                    updatedDog
                })
                return updatedDog
            } catch (err) {
                console.log(err);
            }
        },

        async rejectFriendShip(context, { dog }) {
            try {
                const updatedDog = await dogsService.rejectFriendshipOn(dog)
                context.commit({
                    type: 'rejectDogFriendShip',
                    updatedDog
                })
                return updatedDog
            } catch (err) {
                console.log(err);
            }

        },

        async makeFriendShip(context, { dog }) {
            try {
                const updatedDog = await dogsService.makeFriendshipOn(dog)
                context.commit({
                    type: 'updateDogFriendShip',
                    updatedDog
                })
                return updatedDog
            } catch (err) {
                console.log(err);
            }

        },

        async updateFriendLike(context, { dogId }) {
            // console.log('dog id', dogId)
            try {
                const updateDogId = await dogsService.addLike(dogId)
                    // console.log('const', updateDogId)
                context.commit({
                    type: 'updateDogLikes',
                    updateDogId: updateDogId
                })
                return updateDogId
            } catch (err) {
                console.log(err);
            }
        },


        async updateFriendReq(context, { dogId }) {
            try {
                const updatedDogId = await dogsService.sendFriendReq(dogId)
                context.commit({
                    type: 'updateDogFriendReq',
                    updatedDogId,
                })
                return updatedDogId

            } catch (err) {
                console.log(err)
            }
        },

        async loggedInUser(context) {
            try {
                const userLoggedNow = await dogsService.getLoggedinUser()
                if (userLoggedNow === null) {
                    context.commit({
                        type: 'setLoggedUser',
                        userLoggedNow: null
                    })
                } else context.commit({
                    type: 'setLoggedUser',
                    userLoggedNow
                })
            } catch (err) {
                console.log(err);
            }

        },

    },

})