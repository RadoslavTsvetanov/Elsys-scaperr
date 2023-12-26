terraform{
    required_providers{
    aws = {
        source = "hashicorp/aws"
        version = "~> 3.5.8"
        }
    }
}

provider "aws"{
    region = "eu-central-2"
}

resource "aws_budgets_budget" "budget" {
    name = "monthly-budget"
    budget_type = "COST"
    limit_amount = "5.0"
    limit_unit = "USD"
    time_unit = "MONTHLY"
    time_period_start = "2023-12-28_00:01"
}