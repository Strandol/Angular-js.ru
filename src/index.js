let app = angular.module('userMail', []);

app.controller('userController', function($scope, MsgService) {
    MsgService.loadMessages()
    .then(
        (messages) => { $scope.messages = messages; },
        (err) => { alert(err) }
    )
})

app.service('MsgService', function($q) {
    this.loadMessages = function() {
        return $q((resolve, reject) => {
            $.get('https://api.myjson.com/bins/kpg5f', (response) => {
                resolve(response)
            }).fail((err) => { reject(err); })  
        })
    }
})

app.directive('message', () => {
    return {
        restrict: 'E',
        template: `
            <li>
                <h2>{{msg.addresser}}</h2>
                <h3>{{msg.title}}</h3>
                <p>{{msg.date}}</p>
                <button ng-model="opened" ng-click="opened=!opened">Open message</button>
                <div ng-show="opened">
                    <h4>{{msg.addresser}}</h4>
                    <img src={{msg.addresserImg}}>
                    <p>{{msg.message}}</p>
                </div>
            </li>
        `
    }
})