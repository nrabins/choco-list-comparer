export function parse(input) {
  let lines = input.trim().split('\n');
  lines = prune(lines);
  const packages = lines
    .map(parseLine)
    .filter(p => p !== null);

  return packages;
}

/** Predicates that indicate an invalid package line */
const excludeRules = [
  str => str.startsWith('Chocolatey v'),
  str => str.endsWith('packages installed.')
];

/** Remove lines that aren't actual packages */
function prune(lines) {
  return lines.filter(line => {
    const trimmed = line.trim();
    const exclude = excludeRules.some(rule => rule(trimmed));
    return !exclude;
  });
}

function parseLine(line) {
  const chunks = line.split(' ');
  if (chunks.length != 2) {
    console.warn(`Ignoring malformed package line: "${line}"`)
    return null;
  }
  const name = chunks[0];
  const versionStr = chunks[1];
  const version = parseVersion(versionStr);
  if (version == null) {
    return null;
  }

  return { name, version, versionStr };
}

// Break out the version into its components
function parseVersion(versionStr) {
  const chunks = versionStr.split(".");
  let versionParts = chunks.map(chunk => {
    const versionLevel = {};
    if (chunk.includes('-pre')) {
      const preChunks = chunk.split('-pre');
      if (preChunks.length != 2) {
        console.warn(`Malformed -pre: ${versionStr}`)
        return null;
      }
      versionLevel.number = parseInt(preChunks[0]);
      versionLevel.pre = parseInt(preChunks[1]);
    } else {
      versionLevel.number = parseInt(chunk);
    }
    return versionLevel;
  });

  if (versionParts.some(vp => vp == null)) {
    return null;
  }
  
  return versionParts;
}


export function combinePackages(left, right) {
  const packages = {};
  left.forEach(p => {
    if (!(p.name in packages)) {
      packages[p.name] = {};
    }
    packages[p.name].left = {
      version: p.version,
      versionStr: p.versionStr
    };
  });
  right.forEach(p => {
    if (!(p.name in packages)) {
      packages[p.name] = {};
    }
    packages[p.name].right = {
      version: p.version,
      versionStr: p.versionStr
    };
  })

  const packageList = Object.keys(packages).map(name => {
    const combinedPackage = {
      name
    };

    if (packages[name].left) {
      combinedPackage.left = packages[name].left;
    }
    if (packages[name].right) {
      combinedPackage.right = packages[name].right;
    }
    return combinedPackage;
  });
  packageList.sort((a, b) => a.name > b.name ? 1 : -1);
  return packageList;
}




export const sampleInputLeft =
  `Chocolatey v0.10.15
Alkami.Admin.API 1.0.3
Alkami.Admin.Cms 1.12.0-pre154
Alkami.Admin.Locations 1.0.4-pre010
Alkami.Admin.MessageCenter 1.2.10
Alkami.Admin.MessageRepository 1.0.3
Alkami.Admin.Rules 2.0.1
Alkami.Admin.UserInterface 1.1.2
Alkami.Admin.UserLists 1.3.1
Alkami.Admin.UserManagement 1.0.9-pre011
Alkami.Admin.Widget.Flavors 1.0.1
Alkami.Admin.WidgetSettings 1.1.1-pre8
Alkami.App.Providers.Core.Corelation 1.0.4
Alkami.App.Providers.Core.QuorumSymConnect 1.1.0
Alkami.App.Providers.Core.SymConnect 1.6.0
Alkami.App.Providers.Core.SymConnect.Baxter 1.1.0
Alkami.App.Providers.Core.SymConnect.MACU 1.2.0
Alkami.App.Providers.GenericSingleSignOn.Yodlee.Aggregation 1.0.0
Alkami.App.Providers.Multiplexer.Client 1.2.0
Alkami.Apps.Authentication 1.7.0-pre004
Alkami.Apps.BillPayV2 2.9.0-pre1750
Alkami.Apps.BusinessWires 2.0.11-pre401
Alkami.Apps.CalculatorCalendar 1.0.5-pre024
Alkami.Apps.DashboardV2 1.1.8
Alkami.Apps.Dispute 1.0.5
Alkami.Apps.DraftServices 1.2.3
Alkami.Apps.LoanCoupon 1.0.6
Alkami.Apps.Locations 1.0.14
Alkami.Apps.MessageCenter 1.0.18
Alkami.Apps.MyAccountsV2 2.6.1
Alkami.Apps.Payroll 2.3.5
Alkami.Apps.Settings 1.14.0-pre286
Alkami.Apps.TransferV2 2.1.4-pre0084
Alkami.Client.Widget.MyAccountsV3 1.0.3
Alkami.Client.Widgets.Aggregation 1.0.4
Alkami.Client.Widgets.API 1.4.1
Alkami.Client.Widgets.Budgets 1.1.3
Alkami.Client.Widgets.OAuth 1.10.1
Alkami.Client.Widgets.SavingsGoals 1.1.2-pre016
Alkami.DeveloperKit.Certificates.Common 1.0.5
Alkami.DeveloperKit.Certificates.Common.Employee 1.0.4
Alkami.DeveloperKit.Certificates.Employee.Vendors 1.0.5
Alkami.DeveloperKit.Certificates.Wildcard.Dev 1.2.0
Alkami.DeveloperKit.Employee.Node 1.1.0
Alkami.DeveloperKit.IIS 1.0.5
Alkami.DeveloperKit.IIS.Employee 1.0.1
Alkami.DeveloperKit.Redis 1.0.2
Alkami.DeveloperKit.VSTemplates 2.0.0
Alkami.DeveloperKit.VSTemplates.AdminWidgets 2.1.6
Alkami.DeveloperKit.VSTemplates.Microservices 2.0.8
Alkami.DeveloperKit.VSTemplates.Snippets 2.0.1
Alkami.DeveloperKit.VSTemplates.Widgets 2.1.5
Alkami.EagleEye 1.3.2
Alkami.Installer.Provider 3.0.7
Alkami.Installer.WebApplication 3.0.3
Alkami.Installer.WebExtension 3.0.2
Alkami.Installer.Widget 3.0.3
Alkami.Legacy.Sync.Accounts 1.1.15
Alkami.LocationRepository 1.0.1
Alkami.MachineSetup.DatabaseCore 2019.4.0.3
Alkami.MachineSetup.OrbCore 2019.4.0.3
Alkami.MachineSetup.SDK.Database 2019.4.0.3
Alkami.MachineSetup.SDK.IIS 2019.4.0.3
Alkami.MessageRepository 1.1.3
Alkami.MicroServices.Accounts.Service.Host 2.21.1
Alkami.MicroServices.AddressValidation.SmartyStreets.Host 1.5.9-pre028
Alkami.MicroServices.Aggregation.Service.Host 1.6.0
Alkami.MicroServices.AggregationProviders.Yodlee.Host 3.0.2-pre121
Alkami.MicroServices.Audit.Service.Host 6.16.0
Alkami.MicroServices.Authentication.AD.Service.Host 1.6.3
Alkami.MicroServices.Authentication.Entrust.Service.Host 1.6.2
Alkami.MicroServices.Authorization.Service.Host 1.6.2
Alkami.MicroServices.Broker.Host 2.9.4
Alkami.MicroServices.Choco.Installer.Database 2.4.6
Alkami.MicroServices.Choco.Installer.Logic 2.4.6
Alkami.MicroServices.Choco.Installer.MasterDatabase 2.4.6
Alkami.MicroServices.CMS.Service.Host 11.2.0-pre068
Alkami.MicroServices.Contacts.Service.Host 2.4.10
Alkami.Microservices.DeveloperKit 1.3.3
Alkami.Microservices.DeveloperKit.Employee 1.1.10
Alkami.Microservices.DeveloperKit.GrantPermission 1.0.2
Alkami.Microservices.DeveloperKit.Machine.Config 1.0.4
Alkami.Microservices.DeveloperKit.Machine.Config.Employee 1.0.3
Alkami.MicroServices.EventManagement.SAP.Host 3.5.2
Alkami.MicroServices.EventManagement.Service.Host 3.6.0
Alkami.Microservices.ExtendedProperties.Service.Host 1.1.2
Alkami.MicroServices.Holidays.Service.Host 2.1.17
Alkami.MicroServices.Images.Service.Host 3.1.15
Alkami.MicroServices.MessageCenter.Service.Host 2.1.2-pre049
Alkami.MicroServices.MyAccounts.Service.Host 1.1.4
Alkami.MicroServices.Notifications.Service.Host 1.6.18
Alkami.MicroServices.Payments.Service.Host 8.2.2
Alkami.MicroServices.Risk.Alkami.Service.Host 1.4.10
Alkami.MicroServices.Risk.Entrust.Service.Host 1.4.8
Alkami.MicroServices.Risk.Management.Service.Host 1.4.12
Alkami.MicroServices.Rules.Service.Host 4.1.0-pre059
Alkami.MicroServices.Security.Service.Host 2.18.0
Alkami.MicroServices.Settings.Service.Host 4.5.5
Alkami.MicroServices.SiteText.Service.Host 1.1.19
Alkami.MicroServices.StepUpManager.Service.Host 1.13.0
Alkami.MicroServices.TransactionRefinement.Service.Host 0.0.2
Alkami.MicroServices.Transactions.Service.Host 1.10.0
Alkami.MicroServices.UserInterface.Service.Host 1.19.1
Alkami.Modules.Cms 3.2.0
Alkami.Modules.LegacyAuthAdmin 1.1.8
Alkami.Modules.LegacyAuthClient 1.1.8
Alkami.Modules.RiskEvaluation 2.3.4
Alkami.MS.LocationProviders.Dynamic.Host 1.2.3-pre039
Alkami.MS.MessageCenterManagement.Service.Host 1.0.2-pre026
Alkami.MS.TransactionEnrichment.Service.Host 1.0.1
Alkami.MS.TransactionExportProviders.CSV.Host 1.2.0-pre030
Alkami.MS.TransactionExportProviders.OFX.Host 1.2.0-pre030
Alkami.MS.TransactionExportProviders.QBO.Host 1.2.0-pre030
Alkami.MS.TransactionExportProviders.QFX.Host 1.2.0-pre030
Alkami.Orbital 1.15.0
Alkami.PowerShell.AD 3.1.0
Alkami.PowerShell.Choco 3.10.1
Alkami.PowerShell.Common 3.4.0
Alkami.PowerShell.Configuration 3.4.0
Alkami.PowerShell.Database 1.0.3
Alkami.PowerShell.IIS 3.6.0
Alkami.PowerShell.Migrations 1.2.0
Alkami.PowerShell.ServerManagement 3.2.0
Alkami.PowerShell.Services 3.2.0
Alkami.Security.RPSTS 1.0.5
Alkami.Services.Subscriptions.Host 3.6.5
Alkami.Template.AdminWidget 1.0.5
Alkami.Template.EmbeddedSnippet 2.0.2
Alkami.Template.Microservice 2.0.8
Alkami.Template.Widget 2.1.6
Alkami.Utilities.WebToolKit.Snippets.Runtime 2.0.0
Alkami.WebExtensions.SignalR 1.1.2
Alkami.WebExtensions.YodleeFastLink 2.4.0
Carbon 2.8.1
chocolatey 0.10.15
chocolatey-core.extension 1.3.3
chocolatey-dotnetfx.extension 1.0.1
chocolatey-visualstudio.extension 1.8.1
chocolatey-windowsupdate.extension 1.0.4
dotnetfx 4.8.0.20190930
FiraCode 2.0
git 2.23.0
git.install 2.23.0
KB2919355 1.0.20160915
KB2919442 1.0.20160915
KB2999226 1.0.20181019
KB3033929 1.0.5
KB3035131 1.0.3
nodejs-lts 10.16.3
nuget.commandline 5.2.0
python2 2.7.17
redis-64 3.0.503
vcredist140 14.23.27820
visualstudio-installer 2.0.1
visualstudio2017-workload-vctools 1.3.2
visualstudio2017buildtools 15.9.17.0
155 packages installed.`

export const sampleInputRight = 
`Alkami.Admin.API 1.0.4-pre012
Alkami.Admin.Locations 1.0.3
Alkami.Admin.MessageCenter 1.2.10
Alkami.Admin.MessageRepository 1.0.5
Alkami.Admin.PackageAssignment 2.1.1
Alkami.Admin.Rules 2.1.1
Alkami.Admin.UserInterface 1.1.2
Alkami.Admin.Widget.Flavors 1.0.1
Alkami.Admin.Widgets.Operations 3.7.4-pre392
Alkami.Admin.WidgetSettings 1.1.0
Alkami.Apps.Authentication 1.8.0-pre367
Alkami.Apps.Benefits 1.1.4-pre014
Alkami.Apps.DashboardV2 1.1.15
Alkami.Apps.Dispute 1.1.0-pre024
Alkami.Apps.DraftServices 1.2.3
Alkami.Apps.LoanCoupon 1.0.6
Alkami.Apps.Locations 1.0.14
Alkami.Apps.MessageCenter 1.0.19-pre076
Alkami.Apps.MyAccountsV2 2.6.2-pre239
Alkami.Apps.Payroll 2.3.6-pre043
Alkami.Apps.Settings 1.13.5-pre277
Alkami.Client.Widget.MyAccountsV3 1.0.3-pre022
Alkami.Client.Widgets.API 1.4.2
Alkami.Client.Widgets.Budgets 1.1.5
Alkami.Client.Widgets.OAuth 1.10.2
Alkami.DeveloperKit.Certificates.Common 1.0.5
Alkami.DeveloperKit.Certificates.Common.Employee 1.0.4
Alkami.DeveloperKit.Certificates.Employee.Vendors 1.0.5
Alkami.DeveloperKit.Certificates.Wildcard.Dev 1.2.0
Alkami.DeveloperKit.Employee.Node 1.0.0
Alkami.DeveloperKit.IIS 1.0.5
Alkami.DeveloperKit.IIS.Employee 1.0.1
Alkami.DeveloperKit.Redis 1.0.2
Alkami.DeveloperKit.VSTemplates 2.0.0
Alkami.DeveloperKit.VSTemplates.AdminWidgets 2.1.6
Alkami.DeveloperKit.VSTemplates.Microservices 2.0.8
Alkami.DeveloperKit.VSTemplates.Snippets 2.0.1
Alkami.DeveloperKit.VSTemplates.Widgets 2.1.5
Alkami.EagleEye 1.3.2
Alkami.Installer.Provider 3.0.7
Alkami.Installer.WebApplication 3.0.3
Alkami.Installer.WebExtension 3.0.2
Alkami.Installer.Widget 3.0.3
Alkami.Legacy.Sync.Accounts 1.2.3
Alkami.Legacy.Sync.Transactions 1.1.2
Alkami.LocationRepository 1.0.1
Alkami.MachineSetup.DatabaseCore 2019.4.0.3
Alkami.MachineSetup.OrbCore 2019.4.0.3
Alkami.MachineSetup.SDK.Database 2019.4.0.3
Alkami.MachineSetup.SDK.IIS 2019.4.0.3
Alkami.MessageRepository 1.1.4
Alkami.MicroServices.Accounts.Service.Host 2.21.2
Alkami.MicroServices.AddressValidation.SmartyStreets.Host 1.5.0
Alkami.MicroServices.Aggregation.Service.Host 1.6.0
Alkami.MicroServices.Audit.Service.Host 6.16.0
Alkami.MicroServices.Authentication.AD.Service.Host 1.7.0-pre040
Alkami.MicroServices.Authentication.Entrust.Service.Host 1.7.0-pre040
Alkami.MicroServices.Authentication.Static.Service.Host 1.7.0-pre040
Alkami.MicroServices.Authentication.Workflow.Service.Host 1.9.0-pre046
Alkami.MicroServices.Authorization.Service.Host 1.6.4
Alkami.MicroServices.Authorization.WebApi.Host 1.6.2
Alkami.MicroServices.Broker.Host 2.9.4
Alkami.MicroServices.Choco.Installer.Database 2.4.7
Alkami.MicroServices.Choco.Installer.Logic 2.4.6
Alkami.MicroServices.Choco.Installer.MasterDatabase 2.4.6
Alkami.MicroServices.Contacts.Service.Host 2.4.10
Alkami.Microservices.DeveloperKit 1.3.3
Alkami.Microservices.DeveloperKit.Employee 1.1.9
Alkami.Microservices.DeveloperKit.GrantPermission 1.0.2
Alkami.Microservices.DeveloperKit.Machine.Config 1.0.4
Alkami.Microservices.DeveloperKit.Machine.Config.Employee 1.0.3
Alkami.MicroServices.EventManagement.SAP.Host 3.5.2
Alkami.MicroServices.EventManagement.Service.Host 3.6.1-pre666
Alkami.MicroServices.Features.Service.Host 2.8.16
Alkami.MicroServices.Forms.Service.Host 1.1.2
Alkami.MicroServices.Holidays.Service.Host 2.1.14
Alkami.MicroServices.Images.Service.Host 3.1.15
Alkami.MicroServices.MessageCenter.Service.Host 2.1.2-pre049
Alkami.MicroServices.MyAccounts.Service.Host 1.2.1-pre024
Alkami.MicroServices.Notifications.Service.Host 1.6.17
Alkami.MicroServices.Payments.Service.Host 8.2.2
Alkami.MicroServices.Processor.RIMT.Host 1.0.6-pre010
Alkami.MicroServices.Risk.Alkami.Service.Host 1.4.12-pre111
Alkami.MicroServices.Risk.DetectTA.Service.Host 1.4.12
Alkami.MicroServices.Risk.Entrust.Service.Host 1.4.9-pre111
Alkami.MicroServices.Risk.Management.Service.Host 1.4.13
Alkami.MicroServices.Rules.Package.Service.Host 1.1.2
Alkami.MicroServices.Rules.Service.Host 3.0.2
Alkami.MicroServices.SamlAuth.Service.Host 1.4.5
Alkami.MicroServices.Security.Service.Host 2.18.0
Alkami.MicroServices.Security.WebApi.Host 2.18.0
Alkami.MicroServices.Settings.Service.Host 4.5.8
Alkami.MicroServices.SiteText.Service.Host 1.1.19
Alkami.MicroServices.StepUpManager.Service.Host 1.13.1-pre043
Alkami.MicroServices.Transactions.Service.Host 1.11.0
Alkami.MicroServices.UserInterface.Service.Host 1.19.1
Alkami.MicroServiceTester 1.0.14
Alkami.Modules.LegacyAuthAdmin 1.1.8
Alkami.Modules.LegacyAuthClient 1.1.8
Alkami.Modules.PackageAssignment 2.1.1
Alkami.Modules.RiskEvaluation 2.4.0-pre023
Alkami.Modules.SamlAuthAdmin 1.0.10
Alkami.Modules.TransactionEnrichment 1.0.2-pre019
Alkami.MS.AccountsOrchestration.Service.Host 1.1.0-pre006
Alkami.MS.LocationProviders.COOP.Host 1.2.3-pre039
Alkami.MS.LocationProviders.COOP.ProximitySearch.Host 1.2.3-pre039
Alkami.MS.LocationProviders.Dynamic.Host 1.2.3-pre039
Alkami.MS.MessageCenterManagement.Service.Host 1.0.2-pre026
Alkami.MS.Notifications.SMS.Twilio.Service.Host 1.1.0
Alkami.MS.TDE.MessageProcessor.WebApi.Host 1.0.0
Alkami.MS.TransactionEnrichment.Service.Host 1.0.1
Alkami.MS.TransactionExportProviders.CSV.Host 1.2.1-pre032
Alkami.MS.TransactionExportProviders.OFX.Host 1.2.1-pre032
Alkami.MS.TransactionExportProviders.QBO.Host 1.2.1-pre032
Alkami.MS.TransactionExportProviders.QFX.Host 1.2.1-pre032
Alkami.Orbital 1.34.2-pre0508
Alkami.PowerShell.AD 3.1.0
Alkami.PowerShell.Choco 3.10.1
Alkami.PowerShell.Common 3.4.0
Alkami.PowerShell.Configuration 3.4.0
Alkami.PowerShell.Database 1.0.3
Alkami.PowerShell.IIS 3.6.0
Alkami.PowerShell.Migrations 1.2.0
Alkami.PowerShell.ServerManagement 3.2.0
Alkami.PowerShell.Services 3.2.0
Alkami.SDK.Samples 2.2.6
Alkami.Security.RPSTS 1.0.6
Alkami.Services.Subscriptions.Host 3.6.7
Alkami.Template.AdminWidget 1.0.5
Alkami.Template.EmbeddedSnippet 2.0.2
Alkami.Template.Microservice 2.0.8
Alkami.Template.ProviderService 1.2.1
Alkami.Template.Widget 2.1.6
Alkami.Utilities.WebToolKit.Snippets.Runtime 2.0.0
Alkami.VisaAuthorizationsConverter 2.1.4
Alkami.WebExtensions.SignalR 1.1.3-pre017
Carbon 2.5.0
chocolatey 0.10.15
chocolatey-core.extension 1.3.3
CUFX.SDK.Authorization 1.7.0
git 2.23.0
git.install 2.23.0
Internal.MicroServices.UserSearch.Service.Host 1.3.3
Internal.Website.UserSearch 1.3.3
nodejs-lts 10.16.3
nuget.commandline 5.2.0
poshgit 0.7.3.1
redis-64 3.0.503

`