﻿
using Microsoft.AspNetCore.DataProtection.KeyManagement;

using Umbraco.Extensions;

using uSync.BackOffice.Configuration;

namespace uSync.BackOffice.SyncHandlers
{
    public class HandlerConfigPair
    {
        public ISyncHandler Handler { get; set; }
        public HandlerSettings Settings { get; set; }
    }

    public static class HandlerConfigPairExtensions
    {

        public static bool IsEnabled(this HandlerConfigPair handlerAndConfig)
          => handlerAndConfig.Handler.Enabled && handlerAndConfig.Settings.Enabled;

        public static bool IsValidGroup(this HandlerConfigPair handlerAndConfig, string group)
        {
            // empty means all as does 'all'
            if (string.IsNullOrWhiteSpace(group) || group.InvariantEquals("all")) return true;

            var handlerGroup = handlerAndConfig.Handler.Group;
            if (!string.IsNullOrWhiteSpace(handlerAndConfig.Settings.Group))
            {
                handlerGroup = handlerAndConfig.Settings.Group;
            }

            return group.InvariantContains(handlerGroup);
        }

        public static bool IsValidAction(this HandlerConfigPair handlerAndConfig, HandlerActions action)
        {
            if (action.IsValidAction(handlerAndConfig.Settings.Actions)) return true;
            return false;
        }

        public static string GetConfigGroup(this HandlerConfigPair handlerConfigPair)
        {
            if (!string.IsNullOrWhiteSpace(handlerConfigPair.Settings.Group))
                return handlerConfigPair.Settings.Group;

            return handlerConfigPair.Handler.Group;
        }

        public static string GetGroupIcon(this HandlerConfigPair handlerConfigPair)
        {
            var group = GetConfigGroup(handlerConfigPair);

            if (uSyncConstants.Groups.Icons.ContainsKey(group))
                return uSyncConstants.Groups.Icons[group];

            return handlerConfigPair.Handler.Icon;
        }
    }
}
