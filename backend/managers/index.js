const wagner = require('wagner-core/lib')

module.exports = (wagner) =>
    wagner.factory('JobSeekerManager', () => {
        const JobSeekerManager = require('./JobSeekerManager')
        return new JobSeekerManager(wagner)
    })
    wagner.factory('JobSeekerSerializer', () => {
        const JobSeekerSerializer = require('./serializer/JobSeekerSerialier')
        return new JobSeekerSerializer()
    })
    wagner.factory('LoginManager', () => {
        const LoginManager = require('./LoginManager')
        return new LoginManager(wagner)
    })
    wagner.factory('EmployerManager', () => {
        const EmployerManager = require('./EmployerManager')
        return new EmployerManager(wagner)
    })
    wagner.factory("ServiceManager", () => {
        const ServiceManager = require('./ServiceManager')
        return new ServiceManager(wagner)
    })
    wagner.factory("EmployerMembershipPlanManager", () => {
        const EmployerMembershipPlanManager = require('./EmployerMembershipPlanManager')
        return new EmployerMembershipPlanManager(wagner)
    })
    wagner.factory("JobPostManager", () =>{
        const JobPostManager = require('./JobPostManager')
        return new JobPostManager(wagner)
    })
    wagner.factory('StarredJobManager', () => {
        const StarredJobManager = require('./StarredJobManager')
        return new StarredJobManager(wagner)
    })
    wagner.factory('StarredSeekerManager', () => {
        const StarredSeekerManager = require('./StarredSeekerManager')
        return new StarredSeekerManager(wagner)
    })
    wagner.factory('LoginSerializer', () => {
        const LoginSerializer = require('./serializer/LoginSerializer')
        return new LoginSerializer()
    })
    wagner.factory('EmployerPaymentManager', () => {
        const EmployerPaymentManager = require('./EmployerPaymentManager')
        return new EmployerPaymentManager(wagner)
    })