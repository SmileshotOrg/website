SmileShot DPA 21/9/26

**Solid Solutions Ltd (trading as SmileShot)**

*In accordance with Article 28 of the UK General Data Protection Regulation (UK GDPR)*

This Data Processing Agreement ("**DPA**") governs the processing of personal data in connection with the SmileShot software-as-a-service platform. This DPA supplements and forms an integral part of the B2B Terms of Service between:

- **The Subscriber** (the dental practice, clinic, or registered dental healthcare professional acting in an independent or associate capacity) ("**Data Controller**" or "**Controller**"); and

- **Solid Solutions Ltd (trading as SmileShot)**, a company incorporated in England and Wales under Company Registration Number 6425612, having its registered office at 19 Linfields, Little Chalfont, Amersham, Buckinghamshire, HP7 9QH ("**Data Processor**", "**SmileShot**", "**we**", or "**us**").

The Controller and the Processor are collectively referred to as the "**Parties**" and each individually as a "**Party**".

## **1. Statutory Status & Scope of Agreement**

- **Role Classifications:** For the purposes of the Data Protection Legislation (defined as the UK GDPR and the Data Protection Act 2018), the Subscriber acts as the **Data Controller** in respect of all patient records, patient identifiers, and clinical documentation managed through the platform. Solid Solutions Ltd acts strictly as a **Data Processor **processing personal data exclusively on the documented instructions of the Controller.

- **Associate Clinicians:** Where the Controller is a self-employed or associate dental practitioner operating independently within a practice, the practitioner warrants that they hold independent Controller status for the clinical records and patient datasets they choose to catalogue, structure, and index through their individual SmileShot account.

- **Subject Matter & Purpose:** The subject matter, duration, nature, and purpose of the processing, as well as the types of personal data and categories of data subjects, are specified in **Schedule 1** of this DPA.

## **2. Documented Instructions & Sandboxed Access Perimeter**

- **Strict Adherence to Instructions:** The Processor shall process personal data solely on behalf of, and in accordance with, the documented instructions of the Controller, including with respect to transfers of personal data outside the United Kingdom, unless required to do so by applicable United Kingdom law.

- **Sandboxed Access Boundary ("SmileShot" Folder Only):** The Controller explicitly authorises and instructs the Processor to interface with the Controller’s third-party cloud storage repository (e.g., Google Drive, Microsoft OneDrive, Dropbox) via authenticated API credentials. **The technical scope of this authorisation is strictly confined and sandboxed to a single, designated root directory labelled "SmileShot".**

- **Out-of-Scope Data:** The Processor does not request, hold, or execute technical access to view, catalogue, alter, or interact with any other files, patient records, administrative folders, or practice databases located outside the designated "SmileShot" root folder.

- **Notification of Infringing Instructions:** The Processor shall immediately notify the Controller if, in its reasonable opinion, any instruction given by the Controller infringes the UK GDPR, the Data Protection Act 2018, or other applicable data protection legislation.

## **3. Storage Architecture, Metadata Processing & Zero-Image Visibility**

- **Bring Your Own Storage (BYOS) Architecture:** The Parties acknowledge that SmileShot does not provide primary hosting, data warehousing, or backup repository services for raw clinical photography. All original photographic files remain stored continuously and exclusively within the Controller’s independent cloud storage provider.

- **Metadata-Only Processing:** Processing by the Processor within the sandboxed directory is limited strictly to structural metadata:

- Directory pathways and sub-folder hierarchies;

- Folder naming structures and patient reference tags;

- System timestamps and file creation/modification dates; and

- Authentication and synchronisation tokens.

- **Technical Inability to View Imagery:** The Processor’s platform architecture **lacks the technical capability, access permissions, and software functionality to open, inspect, render, or visually process** the underlying visual image payloads or pixel data stored within the Controller’s cloud repository. The Processor does not process the visual content of clinical photographs as Special Category Data.

## **4. Daylist Capture & Ephemeral AI Processing**

- **Operational Purpose:** Where the Controller elects to utilise the automated Daylist Capture workflow, the Processor is instructed to process photographic images of daily appointment schedules ("**Daylist Imagery**") solely to extract three administrative data fields: **Patient Name, Date of Birth, and Appointment Time**.

- **Ephemeral Processing (RAM Only):** The Daylist Imagery is processed transiently in temporary computer memory (RAM). The source image and any incidental clinical or practice notations visible on the schedule are irretrievably and permanently purged from server memory immediately upon completion of text extraction. No Daylist Imagery is written to non-volatile disk storage.

- **AI Model Training Ban:** The Processor warrants that neither the Daylist Imagery, nor the extracted patient fields, nor any operational metadata shall be used, retained, shared, or ingested to train, fine-tune, or develop any artificial intelligence or machine learning models (including foundation models operated by third-party infrastructure providers).

## **5. Sub-processors & International Transfers**

- **Authorised Sub-processors:** The Controller grants general written authorisation to the Processor to engage the sub-processors set out below to deliver core cloud infrastructure:

| Sub-processor | Entity & Jurisdiction | Processing Activity | Location of Data |
| --- | --- | --- | --- |
| Microsoft Azure | Microsoft Ireland Operations Limited (Ireland / UK) | Database hosting, account telemetry, and encrypted metadata storage (Azure Cosmos DB). | United Kingdom (UK South / UK West) |
| Microsoft Azure OpenAI & Document Intelligence | Microsoft Ireland Operations Limited (Ireland / EU) | Transient optical character recognition (OCR) and ephemeral parsing of Daylist Imagery. | European Economic Area (Sweden Central) |

- **International Transfers & UK Adequacy:** All persistent metadata is retained within data centres in the United Kingdom. Processing of Daylist Imagery within Sweden Central (EEA) is executed pursuant to the UK Government's statutory Adequacy Regulations recognising the European Economic Area as ensuring an equivalent level of data protection.

- **Sub-processor Obligations:** The Processor shall impose data protection terms on any appointed sub-processor that offer at least the same level of protection for Controller data as those set out in this DPA. The Processor remains fully liable to the Controller for the performance of each sub-processor’s obligations.

- **Notification of Changes:** The Processor shall provide the Controller with at least 30 days’ prior written notice of any intended appointment of a new sub-processor, giving the Controller the opportunity to object on reasonable data protection grounds prior to implementation.

## **6. Technical and Organisational Security Measures**

The Processor shall implement and maintain appropriate technical and organisational measures to ensure a level of security appropriate to the operational risk, including:

- **Cryptographic Standards:** All account data, access tokens, and indexed metadata are encrypted in transit using **TLS 1.3** and at rest using **AES-256** encryption within enterprise-grade infrastructure certified to ISO/IEC 27001 and SOC 2 Type II standards.

- **Zero Visual Access:** Technical permissions within the codebase prevent backend engineers, administrators, or software routines from viewing or reconstructing raw patient imagery stored within the Controller's cloud repository.

- **Access Control & Least Privilege:** Role-based access control (RBAC) and strict least-privilege principles govern internal administrative access to platform configuration environments.

- **Confidentiality:** All personnel, contractors, and software engineers authorised to access or handle Controller metadata have committed themselves to binding contractual confidentiality obligations.

## **7. Security Incidents & Personal Data Breaches**

- **Notification Window:** The Processor shall notify the Controller without undue delay, and in any event **within 48 hours**, upon confirming a Personal Data Breach affecting personal data or metadata processed by SmileShot.

- **Breach Details:** The notification shall include, at a minimum:

- A description of the nature of the breach, including the categories and approximate number of data subjects and records concerned;

- The identity of the Processor’s designated contact point for further information;

- The likely consequences of the incident; and

- The remedial measures taken or planned to mitigate potential adverse effects.

- **Remedial Assistance:** The Processor shall provide reasonable cooperation and commercial assistance to enable the Controller to meet its reporting obligations to the Information Commissioner's Office (ICO) and affected data subjects under Articles 33 and 34 of the UK GDPR.

## **8. Data Subject Rights & Regulatory Assistance**

- **Data Subject Requests (DSARs):** Taking into account the nature of the processing, the Processor shall implement appropriate technical and organisational measures to assist the Controller in fulfilling its obligations to respond to data subjects exercising their statutory rights under Chapter III of the UK GDPR (including rights of access, rectification, erasure, and portability).

- **Direct Requests:** If the Processor receives a direct request from a data subject regarding Controller data, the Processor shall not respond directly (save to acknowledge receipt) and shall immediately redirect the data subject to the Controller.

- **Compliance Assessments (DPIAs):** The Processor shall provide reasonable assistance to the Controller with any Data Protection Impact Assessments (DPIAs) and prior consultations with the ICO required under Articles 35 and 36 of the UK GDPR, strictly relevant to the Processor’s administrative organisation services.

## **9. Termination, Deletion & Offboarding**

- **Continuous Controller Ownership:** The Parties expressly acknowledge that because raw clinical photography remains stored exclusively within the Controller’s third-party cloud storage account, the Controller retains uninterrupted physical and legal possession of all clinical images throughout and following the termination of the service.

- **Scope of Return & Deletion:** Upon termination of the underlying Terms of Service, the Processor’s post-termination obligations are strictly limited to:

- Revoking third-party cloud OAuth tokens, terminating all technical access to the sandboxed "SmileShot" folder; and

- Securely purging and permanently deleting all database records, customer metadata, indexing logs, and cached authorisation identifiers held within SmileShot's infrastructure **within 30 days of termination**.

- **Statutory Exception:** The Processor may retain operational logs or telemetry only to the extent required by applicable UK law, provided such data remains securely protected under the terms of this DPA until final destruction.

## **10. Audit Rights & Demonstrable Compliance**

- **Information Provision:** The Processor shall make available to the Controller, upon reasonable written request, all information necessary to demonstrate compliance with Article 28 of the UK GDPR.

- **Audits & Inspections:** The Processor shall permit and contribute to audits, including administrative documentation reviews, conducted by the Controller or an independent professional auditor mandated by the Controller, subject to:

- At least 14 business days’ advance written notice;

- Standard operational hours without disrupting core software operations; and

- Strict confidentiality undertakings preventing the disclosure of SmileShot proprietary source code or multi-tenant system infrastructure.

## **Schedule 1: Processing Details & Data Specification**

| Processing Dimension | Technical & Legal Specification |
| --- | --- |
| Subject Matter | Provision of administrative software for organising, naming, indexing, and categorising clinical dental photography directories via a Bring Your Own Storage (BYOS) framework. |
| Duration of Processing | The term of active platform registration plus a 30-day offboarding data purge period following contract termination. |
| Nature & Operations | Automated folder creation, indexing, timestamp verification, pathway taxonomy organisation, and transient optical character recognition (OCR) of appointment schedules. |
| Categories of Data Subjects | Patients of the subscribing dental practice or associate practitioner; authorised practice staff and registered clinicians. |
| Types of Personal Data | • Administrative Metadata: Patient reference IDs, directory paths, folder names, timestamps, file attributes. • Scheduling Data: Patient Name, Date of Birth, Appointment Time. • Account Data: Practitioner name, professional email address, practice physical address, subscription identifiers. |
| Special Category Data | • Daylist Imagery (Transient Only): Processed ephemerally in RAM solely to parse Name, Date of Birth, and Appointment Time, then instantly discarded. • Raw Clinical Imagery: None. SmileShot does not ingest, view, host, or process the visual pixel data of clinical intraoral/extraoral photographs. |
| Data Storage Locations | • Metadata & Account Data: United Kingdom (Microsoft Azure UK data centres). • Daylist OCR Processing: Sweden Central (Microsoft Azure OpenAI). • Clinical Photographs: Exclusively inside the Controller’s independently managed cloud storage. |
