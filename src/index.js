const USERNAME_REGEXP = /([a-z]+)@gmail.com/;

let app = angular.module('userMail', ['ui.router']);

$('.sectionBlock #input').addClass('selectedSection');
$('.sectionBlock').on('click', function(e) {
    if (e.target.tagName !== 'LABEL')
        return;
    $('.sectionBlock label').removeClass('selectedSection');
    $(e.target).addClass('selectedSection');
})

app.controller('UserController', function(MsgService, ContactService) {
    this.selectedSection = 'input';
    this.isContactsOpen = false;
    
    MsgService.loadUsers()
    .then(
        (users) => {
            this.users = users;
            this.users.forEach((user) => {
                user.inputMsgs = user.messages.filter((msg) => msg.section === 'input');
                user.outputMsgs = user.messages.filter((msg) => msg.section === 'output')
                user.markedMsgs = user.messages.filter((msg) => msg.section === 'marked')
                user.selectedMsgs = user.inputMsgs;
            })
            
            this.selectedUser = this.users[0];
            this.selectedMsgs = this.users[0].inputMsgs;
        },
        (err) => { alert(err) }
    )
    .then(
        () => {
            ContactService.loadContacts()
            .then(
                (contactsInfo) => {
                    let storageContacts = localStorage.getItem('userContactsInfo');
                    if (!storageContacts)
                        localStorage.setItem('userContactsInfo', JSON.stringify(contactsInfo));
                    this.userContactsInfo = storageContacts ? JSON.parse(storageContacts) : contactsInfo; 
                    this.selectedUser.contacts = this.userContactsInfo.find((contacts) => {
                        return contacts.user === this.selectedUser.user;
                    }).contacts
                },
                (err) => { alert(err) }
            )
        }
    )
    
    this.onSectionClickHandler = (section) => {        
        this.isContactsOpen = false;
        this.selectedMsgs = this.selectedUser[`${section}Msgs`];
        this.selectedSection = section;
    }
    
    this.deleteContactByEmail = (email) => {
        let userIndex = this.userContactsInfo.findIndex((userContacts) => {
            return userContacts.user === this.selectedUser.user;
        })
        
        let index = this.userContactsInfo[userIndex].contacts.findIndex((contact) => {
            return contact.mail === email;
        })
        
        this.userContactsInfo[userIndex].contacts.splice(index, 1);
        this.selectedUser.contacts = this.userContactsInfo[userIndex].contacts;
        localStorage.setItem('userContactsInfo', JSON.stringify(this.userContactsInfo));
    }
    
    this.refreshData = () => {
        $('.sectionBlock label').removeClass('selectedSection');
        this.selectedUser.contacts = this.userContactsInfo.find((contacts) => {
            return contacts.user === this.selectedUser.user;
        }).contacts
    }
})

app.config(($stateProvider) => {
    $stateProvider
        .state('index', {
            url: '/',
            template: `
                <message ng-repeat="msg in userController.selectedUser.inputMsgs"></message>
            `
        })
        .state('contacts', {
            url: ':email/contacts',
            template: `
                <div class="contacts">
                    <contacts ng-repeat="contact in userController.selectedUser.contacts"></contacts>
                    <h2 class="noContactsHeader" ng-show="!userController.selectedUser.contacts.length">Контактов не записано...</h2>
                </div>
            `
        })
        .state('welcome', {
            url: ':email/welcome',
            template: '<h2>Hello {{userController.selectedUser.user}}</h2>'
        })
        .state('inputMsgs', {
            url: ':email/messages/input',
            template: `
                <message ng-repeat="msg in userController.selectedUser.inputMsgs"></message>
            `
        })
        .state('outputMsgs', {
            url: ':email/messages/output',
            template: `
                <message ng-repeat="msg in userController.selectedUser.outputMsgs"></message>
            `
        })
        .state('markedMsgs', {
            url: ':email/messages/marked',
            template: `
                <message ng-repeat="msg in userController.selectedUser.markedMsgs"></message>
            `
        })
})

app.service('MsgService', function($q) {
    this.loadUsers = function() {
        return $q((resolve, reject) => {
            $.get('https://api.myjson.com/bins/lfg6n', (response) => {
                resolve(response)
            }).fail((err) => { reject(err); })  
        })
    }
})

app.service('ContactService', function($q) {
    this.loadContacts = function() {
        return $q((resolve, reject) => {
            $.get('https://api.myjson.com/bins/1djcfb', (response) => {
                resolve(response);
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
            <p class="date">{{msg.date}}</p>
            <button class="{{!opened ? 'isClosed' : ''}}" ng-model="opened" ng-click="opened=!opened"></button>
            <div ng-show="opened">
                <h4>{{msg.addresser}}</h4>
                <img src={{msg.addresserImg}}>
                <p>{{msg.message}}</p>
            </div>
        </li>`
    }
})

app.directive('contacts', () => {
    return {
        restrict: 'E',
        template: `<div class="contact">
            <h3>{{contact.name}}</h3>
            <img src={{contact.avatar}}>
            <p>{{contact.age}} лет</p>
            <a href="mailto:{{contact.mail}}">{{contact.mail}}</a><br />
            <button class="contact__deleteContact" ng-click="userController.deleteContactByEmail(contact.mail)">
        </div>`
    }
})