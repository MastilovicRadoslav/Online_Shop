# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ProductPortalAPI/ProductPortalAPI.csproj ./ProductPortalAPI/
COPY . ./
RUN dotnet restore ProductPortalAPI/ProductPortalAPI.csproj

WORKDIR /src/ProductPortalAPI
RUN dotnet publish -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

ENV ASPNETCORE_ENVIRONMENT=Docker
EXPOSE 5000
ENTRYPOINT ["dotnet", "ProductPortalAPI.dll"]
