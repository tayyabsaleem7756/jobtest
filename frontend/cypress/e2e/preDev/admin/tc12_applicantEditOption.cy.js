import * as pages from '../../../core/pageObjects/pages'

describe('TC12 Applicant Edit Modal Test', () => {

    before(() => {
        pages.generalActions.loginAdminUser()
    })

    it('Click on Fund with Status Applicant Review', () => {
        pages.homeActions.clickOnApplicantReviewFund()
    })

    it('Navigate to Applicant Management Tab for the Fund', () => {
        pages.applicantManagementActions.clickOnApplicantManagementTab()
    })

    it('Verify Header Title and Applicant Row', () => {
        pages.applicantManagementActions.verifyHeaderTitle()
        pages.applicantManagementActions.verifyApplicantRecordInTable()
    })

    it('Click on Action Icon and View Option', () => {
        pages.applicantManagementActions.clickOnActionsDotIcon()
        pages.applicantManagementActions.clickOnEditSubActionLink()
    })

    it('Select Vehicle and Share Class Option', () => {
        pages.applicantManagementActions.selectVehicleAndShareClassOption()
    })

    it('Save the Edit Changes', () => {
        pages.applicantManagementActions.clickOnSaveButton()
    })

    after(() => {
        pages.homeActions.clickOnLogoutButton()
    })

})