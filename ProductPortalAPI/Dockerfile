# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Kopiraj .csproj fajl
COPY ProductPortalAPI/ProductPortalAPI/ProductPortalAPI.csproj ./ProductPortalAPI/
RUN dotnet restore ./ProductPortalAPI/ProductPortalAPI.csproj

# Kopiraj ostatak koda
COPY ProductPortalAPI/ProductPortalAPI/ ./ProductPortalAPI/

# Build i publish
WORKDIR /src/ProductPortalAPI
RUN dotnet publish -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

ENV ASPNETCORE_ENVIRONMENT=Docker
EXPOSE 5265
ENTRYPOINT ["dotnet", "ProductPortalAPI.dll"]
