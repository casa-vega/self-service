# GitHub IssueOps Self-Service Portal

This repository serves as a template to create a self-service portal for
managing and sharing IssueOps using GitHub Actions. You can deploy your own
version of this portal using GitHub Pages!

IssueOps are a powerful way to automate various tasks using GitHub Issues. This
repository contains a set of common IssueOps that can be used by developers in
your organization to perform common tasks without needing their corresponding
permissions.

The supported IssueOps can be found in the
[Supported IssueOps](#supported-issueops) section of this README. They are
divided into three categories, based on the permissions they require and the
scope of the operation:

- Enterprise
- Organization
- Repository

## Get Started

1. Fork this repository into an organization you manage.
1. [Enable GitHub Pages](#enable-github-pages) in your forked repository.
1. [Configure GitHub Actions](#configure-github-actions) in your forked
   repository.
1. [Create a GitHub App](#create-a-github-app) and install it on your forked
   repository.
1. If you plan to use the **enterprise** IssueOps, or want to use a single
   repository for IssueOps across multiple organizations,
   [create an enterprise token](#create-an-enterprise-token).
1. Run the [Create IssueOps Labels](./.github/workflows/create-labels.yml)
   workflow in your forked repository to create the required labels.
1. Run the [Continuous Delivery](./.github/workflows/continuous-delivery.yml)
   workflow in your forked repository to deploy the portal.

### Configure GitHub Actions

The following settings should be configured in your forked repository. For more
information, see
[Managing GitHub Actions settings for a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository).

| Setting                                                  | Value                      |
| -------------------------------------------------------- | -------------------------- |
| Workflow permissions                                     | Read and write permissions |
| Allow GitHub Actions to create and approve pull requests | Enabled                    |

### Create a GitHub App

A GitHub App is used to process any **non-enterprise** IssueOps, as well as
IssueOps targeting the same organization where your forked repository is
deployed. When deploying this portal into your own organization, you will need
to create a new GitHub App and install it on your forked repository. For more
information, see
[Creating GitHub Apps](https://docs.github.com/en/apps/creating-github-apps).

The following settings should be configured in your GitHub App:

| Setting         | Value                              |
| --------------- | ---------------------------------- |
| GitHub App name | `IssueOps Bot`                     |
| Homepage URL    | The URL of your forked repository. |
| Private key     | Generate a new private key.        |

#### Configure Permissions

The following permissions encompass all of the IssueOps that can be used by this
portal. However, you can choose to only enable a subset of these permissions. If
you do, make sure to update the [`issue-ops.json`](./data/issue-ops.json) file
to remove any IssueOps that require the disabled permissions.

| Type         | Permission           | Scope          |
| ------------ | -------------------- | -------------- |
| Repository   | Administration       | Read and write |
| Repository   | Contents             | Read-only      |
| Repository   | Issues               | Read and write |
| Repository   | Pull requests        | Read and write |
| Organization | Administration       | Read and write |
| Organization | Members              | Read and write |
| Organization | Announcement banners | Read and write |
| Organization | Projects             | Read and write |
| Organization | Variables            | Read and write |

#### Configure Secrets and Variables

Make sure to set the following values as **secrets** in your forked repository:

| Secret Name                | Value                                          |
| -------------------------- | ---------------------------------------------- |
| `GH_ENTERPRISE_TOKEN`      | The personal access token for your enterprise. |
| `ISSUEOPS_APP_PRIVATE_KEY` | The private key of the GitHub App you created. |

Make sure to set the following values as **variables** in your forked
repository:

| Variable Name            | Value                                        |
| ------------------------ | -------------------------------------------- |
| `ISSUEOPS_APP_CLIENT_ID` | The Client ID of the GitHub App you created. |

### Create an Enterprise Token

If you plan to use the **enterprise** IssueOps, you will need to create a
[personal access token (PAT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)
with the following permissions. This is not required if you are only using the
**non-enterprise** IssueOps.

> [!NOTE]
>
> It is recommended to create a machine user account to use for this token!

| Permission         |
| ------------------ |
| `repo`             |
| `admin:org`        |
| `admin:enterprise` |

### Enable GitHub Pages

Follow the instructions in
[publishing with a custom GitHub Actions workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow).

The workflow is already provided:
[`continuous-delivery.yml`](./.github/workflows/continuous-delivery.yml).

## Supported IssueOps

All of the supported IssueOps are listed in the
[`issue-ops.json`](./data/issue-ops.json) file. They are divided into three
categories, based on the permissions they require and the scope of the
operation:

- Enterprise
- Organization
- Repository

The full list of supported IssueOps can be found in the following table.

| Category     | Name                    | Description                                                              |
| ------------ | ----------------------- | ------------------------------------------------------------------------ |
| Organization | Announcement            | Create an organization announcement banner.                              |
| Organization | Project                 | Create a project for your organization users and repositories.           |
| Organization | GitHub Actions Variable | Create an organization variable to use in your GitHub Actions workflows. |
| Organization | Repository Transfer     | Transfer a repository. Requires enterprise admin approval.               |
| Repository   | Create Repository       | Create a new repository in your organization.                            |
| Repository   | Rename Repository       | Rename a repository in your organization.                                |
| Repository   | Archive Repository      | Archive a repository in your organization, converting it to read-only.   |
| Repository   | Change Visibility       | Change the visibility of your repository.                                |
| Repository   | Unarchive Repository    | Unarchive a repository.                                                  |

## Adding New IssueOps

See the [CONTRIBUTING.md](./CONTRIBUTING.md) file for instructions on how to add
new IssueOps to this portal.

## License

This project is licensed under the terms of the MIT open source license. Please
refer to [LICENSE](./LICENSE) for the full terms.
