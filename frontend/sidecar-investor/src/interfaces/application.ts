export interface Application {
    id: number;
    status: number;
    status_display: string;
    kyc_record: {
        uuid: string;
        status: number;
        id: number;
        status_display: string;
    };
    tax_record: {
        uuid: string;
        status: number;
        status_display: string;
    };
    uuid: string;
    fund: {
        slug: string;
        name: string;
    };
    created_at: string;
    eligibility_response: number;
    is_application_updated: boolean;
    update_comment: string;
    withdrawn_comment: string;
    max_leverage_ratio: number;
    has_custom_equity: boolean;
    has_custom_leverage: boolean;
    has_custom_total_investment: boolean;
}

export interface IApplicationStatus {
    is_allocation_approved: boolean;
    is_aml_kyc_approved: boolean;
    is_tax_info_submitted: boolean;
    is_payment_info_submitted: boolean;
    is_approved: boolean;
}

export interface IApplicationNextState {
    status: 'continue' | 'pending' | 'approved' | 'changes_requested'
    next_url: string
    changes_requested_module: string
    application_completed?: boolean
}