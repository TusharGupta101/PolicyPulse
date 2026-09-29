"""
PolicyPulse Database Migration Utility: SQLite to Hosted MySQL
-------------------------------------------------------------
Safely copies all existing records (Users, Profiles, Schemes, Eligibility Rules,
Documents, Eligibility Results, Applications) from a local SQLite database
(e.g., financial_policy.db) to a target MySQL database (from DATABASE_URL or CLI).

Usage:
    python migrate_sqlite_to_mysql.py
    python migrate_sqlite_to_mysql.py --sqlite sqlite:///./financial_policy.db --mysql mysql+pymysql://user:pass@host:3306/dbname
"""

import sys
import os
import argparse
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

# Ensure backend root is on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from app.database import Base, normalize_database_url
from app.config import settings
from app.models.user import User
from app.models.profile import Profile
from app.models.scheme import Scheme
from app.models.eligibility_rule import EligibilityRule
from app.models.document import Document
from app.models.eligibility_result import EligibilityResult
from app.models.application import Application

def migrate(sqlite_url: str, mysql_url: str):
    print("=" * 60)
    print("PolicyPulse: SQLite -> Hosted MySQL Migration Tool")
    print("=" * 60)
    print(f"Source (SQLite): {sqlite_url}")
    # Mask password for secure logging
    safe_mysql_url = mysql_url
    if "@" in mysql_url and ":" in mysql_url:
        try:
            prefix, rest = mysql_url.split("://", 1)
            creds, host_part = rest.split("@", 1)
            user = creds.split(":", 1)[0]
            safe_mysql_url = f"{prefix}://{user}:****@{host_part}"
        except Exception:
            safe_mysql_url = "[credentials hidden]"
    print(f"Target (MySQL):  {safe_mysql_url}")
    print("-" * 60)

    # 1. Connect to SQLite
    src_engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    SrcSession = sessionmaker(bind=src_engine)
    src_db = SrcSession()

    # 2. Connect to MySQL
    target_engine = create_engine(
        mysql_url,
        pool_pre_ping=True,
        pool_recycle=300
    )
    TargetSession = sessionmaker(bind=target_engine)
    target_db = TargetSession()

    try:
        # Create all tables on MySQL
        print("Ensuring target MySQL schema and tables exist...")
        Base.metadata.create_all(bind=target_engine)
        print("Schema verified on target.")

        # Migrate Users
        print("\n[1/7] Migrating Users...")
        users = src_db.query(User).all()
        user_count = 0
        for u in users:
            existing = target_db.query(User).filter(User.email == u.email).first()
            if not existing:
                new_u = User(
                    id=u.id,
                    email=u.email,
                    hashed_password=u.hashed_password,
                    full_name=u.full_name,
                    role=u.role,
                    is_active=u.is_active,
                    created_at=u.created_at,
                    updated_at=u.updated_at
                )
                target_db.add(new_u)
                user_count += 1
        target_db.commit()
        print(f"  -> Migrated {user_count} users (total source: {len(users)}).")

        # Migrate Profiles
        print("\n[2/7] Migrating Profiles...")
        profiles = src_db.query(Profile).all()
        profile_count = 0
        for p in profiles:
            existing = target_db.query(Profile).filter(Profile.user_id == p.user_id).first()
            if not existing:
                new_p = Profile(
                    id=p.id,
                    user_id=p.user_id,
                    age=p.age,
                    gender=p.gender,
                    annual_income=p.annual_income,
                    state=p.state,
                    occupation=p.occupation,
                    caste_category=p.caste_category,
                    disability_status=p.disability_status,
                    marital_status=p.marital_status,
                    land_ownership_acres=p.land_ownership_acres,
                    has_ration_card=p.has_ration_card,
                    has_bpl_card=p.has_bpl_card,
                    is_student=p.is_student,
                    is_senior_citizen=p.is_senior_citizen,
                    is_minority=p.is_minority,
                    extra_attributes=p.extra_attributes,
                    created_at=p.created_at,
                    updated_at=p.updated_at
                )
                target_db.add(new_p)
                profile_count += 1
        target_db.commit()
        print(f"  -> Migrated {profile_count} profiles (total source: {len(profiles)}).")

        # Migrate Schemes
        print("\n[3/7] Migrating Schemes...")
        schemes = src_db.query(Scheme).all()
        scheme_count = 0
        for s in schemes:
            existing = target_db.query(Scheme).filter(Scheme.code == s.code).first()
            if not existing:
                new_s = Scheme(
                    id=s.id,
                    code=s.code,
                    name=s.name,
                    description=s.description,
                    category=s.category,
                    target_users=s.target_users,
                    state_applicability=s.state_applicability,
                    benefit_type=s.benefit_type,
                    benefit_amount=s.benefit_amount,
                    benefit_description=s.benefit_description,
                    required_documents=s.required_documents,
                    application_steps=s.application_steps,
                    official_source_url=s.official_source_url,
                    application_url=s.application_url,
                    is_active=s.is_active,
                    created_at=s.created_at,
                    updated_at=s.updated_at
                )
                target_db.add(new_s)
                scheme_count += 1
        target_db.commit()
        print(f"  -> Migrated {scheme_count} schemes (total source: {len(schemes)}).")

        # Migrate Rules
        print("\n[4/7] Migrating Eligibility Rules...")
        rules = src_db.query(EligibilityRule).all()
        rule_count = 0
        for r in rules:
            existing = target_db.query(EligibilityRule).filter(
                EligibilityRule.scheme_id == r.scheme_id,
                EligibilityRule.field == r.field,
                EligibilityRule.operator == r.operator,
                EligibilityRule.value == r.value
            ).first()
            if not existing:
                new_r = EligibilityRule(
                    id=r.id,
                    scheme_id=r.scheme_id,
                    field=r.field,
                    operator=r.operator,
                    value=r.value,
                    value_type=r.value_type,
                    description=r.description,
                    source_section=r.source_section,
                    is_mandatory=r.is_mandatory,
                    created_at=r.created_at
                )
                target_db.add(new_r)
                rule_count += 1
        target_db.commit()
        print(f"  -> Migrated {rule_count} rules (total source: {len(rules)}).")

        # Migrate Documents
        print("\n[5/7] Migrating Document Records...")
        docs = src_db.query(Document).all()
        doc_count = 0
        for d in docs:
            existing = target_db.query(Document).filter(Document.id == d.id).first()
            if not existing:
                new_d = Document(
                    id=d.id,
                    user_id=d.user_id,
                    original_filename=d.original_filename,
                    stored_filename=d.stored_filename,
                    file_path=d.file_path,
                    file_type=d.file_type,
                    document_type=d.document_type,
                    file_size=d.file_size,
                    processing_status=d.processing_status,
                    extracted_text=d.extracted_text,
                    extracted_metadata=d.extracted_metadata,
                    upload_time=d.upload_time
                )
                target_db.add(new_d)
                doc_count += 1
        target_db.commit()
        print(f"  -> Migrated {doc_count} document records (total source: {len(docs)}).")

        # Migrate Eligibility Results
        print("\n[6/7] Migrating Eligibility Results...")
        results = src_db.query(EligibilityResult).all()
        res_count = 0
        for er in results:
            existing = target_db.query(EligibilityResult).filter(EligibilityResult.id == er.id).first()
            if not existing:
                new_er = EligibilityResult(
                    id=er.id,
                    user_id=er.user_id,
                    scheme_id=er.scheme_id,
                    status=er.status,
                    estimated_benefit=er.estimated_benefit,
                    passed_criteria=er.passed_criteria,
                    failed_criteria=er.failed_criteria,
                    missing_information=er.missing_information,
                    explanation=er.explanation,
                    source_reference=er.source_reference,
                    checked_at=er.checked_at
                )
                target_db.add(new_er)
                res_count += 1
        target_db.commit()
        print(f"  -> Migrated {res_count} eligibility results (total source: {len(results)}).")

        # Migrate Applications
        print("\n[7/7] Migrating Applications...")
        apps = src_db.query(Application).all()
        app_count = 0
        for a in apps:
            existing = target_db.query(Application).filter(Application.application_reference_number == a.application_reference_number).first()
            if not existing:
                new_a = Application(
                    id=a.id,
                    user_id=a.user_id,
                    scheme_id=a.scheme_id,
                    application_reference_number=a.application_reference_number,
                    status=a.status,
                    notes=a.notes,
                    submitted_at=a.submitted_at,
                    updated_at=a.updated_at
                )
                target_db.add(new_a)
                app_count += 1
        target_db.commit()
        print(f"  -> Migrated {app_count} applications (total source: {len(apps)}).")

        print("\n" + "=" * 60)
        print("Migration to MySQL completed successfully without errors!")
        print("=" * 60)

    finally:
        src_db.close()
        target_db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Migrate PolicyPulse SQLite data to hosted MySQL.")
    parser.add_argument("--sqlite", default="sqlite:///./financial_policy.db", help="Source SQLite connection string")
    parser.add_argument("--mysql", default=None, help="Target MySQL connection string (defaults to DATABASE_URL in .env)")

    args = parser.parse_args()
    mysql_target = args.mysql or settings.DATABASE_URL
    mysql_target = normalize_database_url(mysql_target)

    if not ("mysql" in mysql_target):
        print("ERROR: Target database URL must be a MySQL connection string.")
        print("Example: mysql+pymysql://user:password@host:3306/dbname")
        print(f"Current target value was: {mysql_target}")
        sys.exit(1)

    migrate(args.sqlite, mysql_target)
