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
        this.selectedMsgs = this.selectedUser[this.selectedSection + 'Msgs'];
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
        .state('messages', {
            url: ':email/messages',
            template: `
                <message ng-repeat="msg in userController.selectedMsgs"></message>
            `
        })
        .state('messages.input', {
            url: '/input',
            template: `
                <message ng-repeat="msg in userController.selectedUser.inputMsgs"></message>
            `
        })
        .state('messages.output', {
            url: '/output',
            template: `
                <message ng-repeat="msg in userController.selectedUser.outputMsgs"></message>
            `
        })
        .state('messages.marked', {
            url: '/marked',
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
        templateUrl: 'src/messages.html'
    }
})

app.directive('contacts', () => {
    return {
        restrict: 'E',
        templateUrl: 'src/contacts.html'
    }
})
