import { getAllOrganizations, getOrganizationDetails,createOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const orgPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

const showOrgDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('org_details', {title, organizationDetails, projects});
};

const displayOrganizationForm = async (requestAnimationFrame,res) => {
  const title = 'Add New Organization';

  res.render('new_organization', {title});
};

const processOrganizationForm = async (req, res) => {
    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    res.redirect(`/organization/${organizationId}`);
};

export {orgPage, showOrgDetailsPage, displayOrganizationForm, processOrganizationForm};