import sys
import os

# Ensure backend root is on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.profile import Profile
from app.models.scheme import Scheme
from app.models.eligibility_rule import EligibilityRule
from app.models.document import Document
from app.api.deps import hash_password

def run_seed():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Create Demo User
        demo_email = "demo@example.com"
        user = db.query(User).filter(User.email == demo_email).first()
        if not user:
            print("Creating demo account: demo@example.com / DemoPassword123!")
            user = User(
                email=demo_email,
                hashed_password=hash_password("DemoPassword123!"),
                full_name="Aarav Sharma",
                role="citizen",
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # Profile for demo user
            profile = Profile(
                user_id=user.id,
                age=34,
                gender="Male",
                annual_income=180000.0,
                state="Uttar Pradesh",
                occupation="Farmer",
                caste_category="OBC",
                disability_status=False,
                marital_status="Married",
                land_ownership_acres=2.5,
                has_ration_card=True,
                has_bpl_card=False,
                is_student=False,
                is_senior_citizen=False,
                is_minority=False,
                extra_attributes={"village": "Sonbhadra", "cultivated_crop": "Wheat and Pulses"}
            )
            db.add(profile)
            db.commit()

            # Seed sample verified document for demo user
            sample_doc = Document(
                user_id=user.id,
                original_filename="Aadhaar_Card_Sample.pdf",
                stored_filename=f"{user.id}_sample_aadhaar.pdf",
                file_path=os.path.join(BACKEND_DIR, "..", "uploads", f"{user.id}_sample_aadhaar.pdf"),
                file_type="application/pdf",
                document_type="Aadhaar Card",
                file_size=142850,
                processing_status="PROCESSED",
                extracted_text="GOVERNMENT OF INDIA\nUNIQUE IDENTIFICATION AUTHORITY OF INDIA\nAadhaar Card\nName: Aarav Sharma\nDOB: 15/08/1990\nGender: Male\nAddress: Uttar Pradesh, India",
                extracted_metadata={"document_type_detected": "Aadhaar Card"}
            )
            db.add(sample_doc)
            db.commit()
            print("Demo user, profile, and initial document created.")
        else:
            print("Demo user already exists.")

        # 2. Seed Schemes and Eligibility Rules
        schemes_data = [
            {
                "code": "PM_KISAN",
                "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                "description": "Central Sector scheme with 100% funding from Government of India providing income support of Rs. 6,000 per year in three equal installments to all cultivable landholding farmer families.",
                "category": "Agriculture",
                "target_users": "Small and Marginal Farmers",
                "state_applicability": "All India",
                "benefit_type": "Direct Cash Transfer",
                "benefit_amount": 6000.0,
                "benefit_description": "₹6,000 per year transferred directly to bank account in 3 installments of ₹2,000 every four months.",
                "required_documents": ["Aadhaar Card", "Land Records", "Bank Passbook"],
                "application_steps": [
                    "Visit the official PM-KISAN portal (pmkisan.gov.in)",
                    "Click on 'New Farmer Registration' under Farmers Corner",
                    "Enter your Aadhaar Number and select your State",
                    "Provide land ownership record details (Khasra/Khatauni)",
                    "Submit and note down the registration acknowledgment number"
                ],
                "official_source_url": "https://pmkisan.gov.in",
                "application_url": "https://pmkisan.gov.in/RegistrationFormNew.aspx",
                "rules": [
                    {
                        "field": "occupation",
                        "operator": "==",
                        "value": "Farmer",
                        "value_type": "string",
                        "description": "Primary occupation must be farming or agricultural cultivation",
                        "source_section": "Clause 2.1",
                        "is_mandatory": True
                    },
                    {
                        "field": "land_ownership_acres",
                        "operator": "<=",
                        "value": "5.0",
                        "value_type": "number",
                        "description": "Land ownership must not exceed 5.0 acres (2 hectares)",
                        "source_section": "Clause 3.2",
                        "is_mandatory": True
                    },
                    {
                        "field": "annual_income",
                        "operator": "<=",
                        "value": "400000",
                        "value_type": "number",
                        "description": "Annual household income must not exceed ₹4,00,000",
                        "source_section": "Clause 3.5",
                        "is_mandatory": True
                    }
                ]
            },
            {
                "code": "PMAY_U",
                "name": "Pradhan Mantri Awas Yojana - Urban (PMAY-U)",
                "description": "Government flagship mission to provide pucca houses to all eligible urban households including slum dwellers, EWS, and LIG segments.",
                "category": "Housing",
                "target_users": "Urban Low-Income Families",
                "state_applicability": "All India",
                "benefit_type": "Subsidy",
                "benefit_amount": 250000.0,
                "benefit_description": "Up to ₹2,50,000 upfront interest subsidy on home construction loans under CLSS.",
                "required_documents": ["Aadhaar Card", "Income Certificate", "Bank Passbook"],
                "application_steps": [
                    "Navigate to pmaymis.gov.in",
                    "Select 'Citizen Assessment' and choose 'Benefit under other 3 components'",
                    "Verify Aadhaar number and enter household income details",
                    "Upload income certificate and bank passbook",
                    "Print assessment receipt for ULB physical inspection"
                ],
                "official_source_url": "https://pmaymis.gov.in",
                "application_url": "https://pmaymis.gov.in/Open/Check_Aadhar_Existence.aspx",
                "rules": [
                    {
                        "field": "annual_income",
                        "operator": "<=",
                        "value": "600000",
                        "value_type": "number",
                        "description": "Annual household income must not exceed ₹6,00,000 (EWS/LIG limit)",
                        "source_section": "Section 4.1",
                        "is_mandatory": True
                    },
                    {
                        "field": "age",
                        "operator": ">=",
                        "value": "21",
                        "value_type": "number",
                        "description": "Applicant must be at least 21 years of age",
                        "source_section": "Section 5.1",
                        "is_mandatory": True
                    }
                ]
            },
            {
                "code": "PM_JAY",
                "name": "Ayushman Bharat - PM Jan Arogya Yojana (PM-JAY)",
                "description": "World\'s largest government-funded health assurance scheme covering secondary and tertiary hospital care for vulnerable families.",
                "category": "Healthcare",
                "target_users": "Low-Income and Rural Households",
                "state_applicability": "All India",
                "benefit_type": "Insurance",
                "benefit_amount": 500000.0,
                "benefit_description": "Cashless and paperless access to healthcare services up to ₹5,00,000 per family per year.",
                "required_documents": ["Aadhaar Card", "Ration Card"],
                "application_steps": [
                    "Check name in SECC/Ration database on mera.pmjay.gov.in",
                    "Visit nearest Empaneled Health Care Provider (EHCP) or CSC center",
                    "Complete biometric e-KYC using Aadhaar Card and Ration Card",
                    "Receive Ayushman Golden Card for cashless hospital admissions"
                ],
                "official_source_url": "https://pmjay.gov.in",
                "application_url": "https://mera.pmjay.gov.in",
                "rules": [
                    {
                        "field": "annual_income",
                        "operator": "<=",
                        "value": "250000",
                        "value_type": "number",
                        "description": "Annual income must be under ₹2,50,000 or verified under priority ration category",
                        "source_section": "Guideline 2.4",
                        "is_mandatory": True
                    },
                    {
                        "field": "has_ration_card",
                        "operator": "==",
                        "value": "true",
                        "value_type": "boolean",
                        "description": "Must possess an active state Food & Civil Supplies Ration Card",
                        "source_section": "Guideline 3.1",
                        "is_mandatory": True
                    }
                ]
            },
            {
                "code": "PMMY",
                "name": "Pradhan Mantri Mudra Yojana (PMMY)",
                "description": "Provides financial assistance and formal credit to non-corporate small businesses, artisans, and retail entrepreneurs without collateral.",
                "category": "Business",
                "target_users": "Entrepreneurs, Small Merchants, Artisans",
                "state_applicability": "All India",
                "benefit_type": "Loan",
                "benefit_amount": 500000.0,
                "benefit_description": "Collateral-free institutional business loan up to ₹5,00,000 under Kishore category.",
                "required_documents": ["Aadhaar Card", "Bank Passbook", "Business Registration"],
                "application_steps": [
                    "Prepare business proposal and revenue projections",
                    "Visit any commercial bank, RRB, or MFI branch",
                    "Submit PMMY Application Form along with Aadhaar and business quotation",
                    "Loan is sanctioned and Mudra debit card issued"
                ],
                "official_source_url": "https://www.mudra.org.in",
                "application_url": "https://www.udyamimitra.in",
                "rules": [
                    {
                        "field": "occupation",
                        "operator": "IN",
                        "value": "Business,Self-Employed,Artisan",
                        "value_type": "list",
                        "description": "Occupation must be Business, Self-Employed, or Artisan",
                        "source_section": "Chapter 3 - Section A",
                        "is_mandatory": True
                    },
                    {
                        "field": "age",
                        "operator": ">=",
                        "value": "18",
                        "value_type": "number",
                        "description": "Applicant must be of legal majority (age >= 18)",
                        "source_section": "Chapter 3 - Section B",
                        "is_mandatory": True
                    }
                ]
            },
            {
                "code": "SSY",
                "name": "Sukanya Samriddhi Yojana (SSY)",
                "description": "High-interest, tax-free small deposit scheme for girl children to support higher education and wedding expenses under Beti Bachao Beti Padhao.",
                "category": "Social Security",
                "target_users": "Parents or Guardians of Girl Children (Age <= 10)",
                "state_applicability": "All India",
                "benefit_type": "High-Yield Savings & Tax Relief",
                "benefit_amount": 150000.0,
                "benefit_description": "8.2% guaranteed sovereign annual interest plus full Section 80C tax exemption up to ₹1,50,000/year.",
                "required_documents": ["Birth Certificate", "Aadhaar Card"],
                "application_steps": [
                    "Visit any Post Office or authorized commercial bank branch",
                    "Fill SSY Account Opening Form (Form-1)",
                    "Submit child\'s Birth Certificate and parent\'s Aadhaar",
                    "Deposit initial minimum sum of ₹250"
                ],
                "official_source_url": "https://www.indiapost.gov.in",
                "application_url": "https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx",
                "rules": [
                    {
                        "field": "gender",
                        "operator": "==",
                        "value": "Female",
                        "value_type": "string",
                        "description": "Beneficiary girl child must be female",
                        "source_section": "Sec 3.1",
                        "is_mandatory": True
                    },
                    {
                        "field": "age",
                        "operator": "<=",
                        "value": "10",
                        "value_type": "number",
                        "description": "Age must not exceed 10 years at time of account opening",
                        "source_section": "Sec 3.2",
                        "is_mandatory": True
                    }
                ]
            },
            {
                "code": "NSAP_IGNOAPS",
                "name": "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
                "description": "Provides monthly non-contributory social security pension to elderly citizens living below the poverty line.",
                "category": "Social Security",
                "target_users": "Senior Citizens in BPL Families",
                "state_applicability": "All India",
                "benefit_type": "Pension",
                "benefit_amount": 12000.0,
                "benefit_description": "₹1,000 per month (₹12,000 per year) direct bank pension transfer.",
                "required_documents": ["Aadhaar Card", "BPL Card", "Bank Passbook"],
                "application_steps": [
                    "Submit application form at Block Development Office (BDO) or Municipal Office",
                    "Attach certified copy of BPL card and proof of age",
                    "Verification by Gram Panchayat Secretary / Ward Officer",
                    "Monthly pension credited to bank account"
                ],
                "official_source_url": "https://nsap.nic.in",
                "application_url": "https://nsap.nic.in/applyonline.do",
                "rules": [
                    {
                        "field": "age",
                        "operator": ">=",
                        "value": "60",
                        "value_type": "number",
                        "description": "Applicant must be 60 years of age or older",
                        "source_section": "Article 4.1",
                        "is_mandatory": True
                    },
                    {
                        "field": "has_bpl_card",
                        "operator": "==",
                        "value": "true",
                        "value_type": "boolean",
                        "description": "Applicant household must hold a verified Below Poverty Line (BPL) card",
                        "source_section": "Article 4.3",
                        "is_mandatory": True
                    }
                ]
            },
            {
                "code": "STAND_UP_INDIA",
                "name": "Stand-Up India Scheme",
                "description": "Promotes entrepreneurship among women and SC/ST communities for manufacturing, service, and trading greenfield projects.",
                "category": "Business",
                "target_users": "Women and SC/ST Entrepreneurs",
                "state_applicability": "All India",
                "benefit_type": "Loan",
                "benefit_amount": 2500000.0,
                "benefit_description": "Bank loan between ₹10 Lakh and ₹1 Crore for establishing a new enterprise.",
                "required_documents": ["Aadhaar Card", "Caste Certificate", "Business Plan"],
                "application_steps": [
                    "Log into Stand-Up Mitra portal (standupmitra.in)",
                    "Select borrower category (Woman / SC / ST)",
                    "Fill in project report, cost estimation, and promoter contribution",
                    "Connect with lead bank branch for processing"
                ],
                "official_source_url": "https://www.standupmitra.in",
                "application_url": "https://www.standupmitra.in/Login/Register",
                "rules": [
                    {
                        "field": "caste_category",
                        "operator": "IN",
                        "value": "SC,ST",
                        "value_type": "list",
                        "description": "Applicant must belong to Scheduled Caste (SC) or Scheduled Tribe (ST), or be a woman",
                        "source_section": "Directive 2.1",
                        "is_mandatory": True
                    },
                    {
                        "field": "age",
                        "operator": ">=",
                        "value": "18",
                        "value_type": "number",
                        "description": "Applicant must be at least 18 years old",
                        "source_section": "Directive 2.2",
                        "is_mandatory": True
                    }
                ]
            },
            {
                "code": "POST_MATRIC_SCHOLARSHIP",
                "name": "Post-Matric Scholarship for SC/ST/OBC Students",
                "description": "Financial support for higher education (Class 11 to Ph.D.) to reduce dropout rates among historically marginalized communities.",
                "category": "Education",
                "target_users": "SC, ST, and OBC Students in Higher Education",
                "state_applicability": "All India",
                "benefit_type": "Scholarship",
                "benefit_amount": 30000.0,
                "benefit_description": "₹30,000 annual maintenance allowance plus 100% compulsory non-refundable college fees.",
                "required_documents": ["Aadhaar Card", "Income Certificate", "Caste Certificate", "College ID"],
                "application_steps": [
                    "Register on National Scholarship Portal (scholarships.gov.in)",
                    "Provide Student Details, OTR/Aadhaar authentication",
                    "Select Scheme and upload Caste, Income, and Bonafide College certificates",
                    "Institute verification followed by DBT direct transfer"
                ],
                "official_source_url": "https://scholarships.gov.in",
                "application_url": "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
                "rules": [
                    {
                        "field": "is_student",
                        "operator": "==",
                        "value": "true",
                        "value_type": "boolean",
                        "description": "Applicant must be an actively enrolled student",
                        "source_section": "Section 5.1",
                        "is_mandatory": True
                    },
                    {
                        "field": "caste_category",
                        "operator": "IN",
                        "value": "SC,ST,OBC",
                        "value_type": "list",
                        "description": "Caste category must be SC, ST, or OBC",
                        "source_section": "Section 5.2",
                        "is_mandatory": True
                    },
                    {
                        "field": "annual_income",
                        "operator": "<=",
                        "value": "250000",
                        "value_type": "number",
                        "description": "Total family annual income must not exceed ₹2,50,000",
                        "source_section": "Section 5.4",
                        "is_mandatory": True
                    }
                ]
            }
        ]

        for s_data in schemes_data:
            rules_data = s_data.pop("rules")
            existing_s = db.query(Scheme).filter(Scheme.code == s_data["code"]).first()
            if not existing_s:
                scheme = Scheme(**s_data)
                db.add(scheme)
                db.commit()
                db.refresh(scheme)

                for r_data in rules_data:
                    rule = EligibilityRule(scheme_id=scheme.id, **r_data)
                    db.add(rule)
                db.commit()
                print(f"Seeded scheme: {scheme.name}")
            else:
                print(f"Scheme {s_data['code']} already present.")

        print("Seeding completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()
